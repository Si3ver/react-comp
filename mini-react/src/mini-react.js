(function() {
  function createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map((child) => {
          const isTextNode = typeof child === 'string' || typeof child === 'number';
          return isTextNode ? createTextNode(child) : child;
        }) 
      }
    };
  }

  function createTextNode(nodeValue) {
    return {
      type: 'TEXT_ELEMENT',
      props: {
        nodeValue,
        children: [],
      },
    };
  }

  let nextUnitOfWork = null; // 下一个要处理的 fiber 节点
  let wipRoot = null; // 当前处理的 fiber 链表的根节点
  let currentRoot = null; // 之前的历史 fiber 链表根节点
  let deletions = null; // 要删除的节点

  function render(element, container) {
    wipRoot = {
      dom: container,
      props: {
        children: [element],
      },
      alternate: currentRoot,
    }

    deletions = [];

    nextUnitOfWork = wipRoot; // 下一个 fiber 初始化为 wipRoot
  }

  function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
      nextUnitOfWork = performUnitOfWork( // 处理一个 fiber 节点
        nextUnitOfWork
      );
      shouldYield = deadline.timeRemaining() < 1; // 时间分片快要用完就中断执行，把任务放入异步队列
    }
    requestIdleCallback(workLoop);
  }

  requestIdleCallback(workLoop);

  // 按 child - sibling - return 的顺序逐个处理 fiber 节点
  function performUnitOfWork(fiber) {
    const isFunctionComponent = fiber.type instanceof Function;
    if (isFunctionComponent) {
      updateFunctionComponent(fiber)
    } else {
      updateHostComponent(fiber);
    }
    if (fiber.child) {
      return fiber.child;
    }
    let nextFiber = fiber;
    while (nextFiber) {
      if (nextFiber.sibling) {
        return nextFiber.sibling;
      }
      nextFiber = nextFiber.return;
    }
  }

  let wipFiber = null; // 当前处理的 fiber
  let stateHookIndex = null;

  function updateFunctionComponent(fiber) {
    wipFiber = fiber;
    stateHookIndex = 0;
    wipFiber.stateHooks = [];  // 存储 useState 的 hook 的值
    wipFiber.effectHooks = []; // 存储 useEffect 的 hook 的值

    const children = [fiber.type(fiber.props)];
    reconcileChildren(fiber, children);
  }

  // 浏览器原生标签
  function updateHostComponent(fiber) {
    if (!fiber.dom) {
      fiber.dom = createDom(fiber);
    }
    reconcileChildren(fiber, fiber.props.children);
  }

  function createDom(fiber) {
    const dom =
      fiber.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(fiber.type)

    updateDom(dom, {}, fiber.props);
    return dom;
  }

  const isEvent = key => key.startsWith('on');
  const isProperty = key => key !== 'children' && !isEvent(key);
  const isNew = (prev, next) => key => prev[key] !== next[key];
  const isGone = (prev, next) => key => !(key in next);

  function updateDom(dom, prevProps, nextProps) {
    // remove old or changed event listeners
    Object.keys(prevProps)
      .filter(isEvent)
      .filter(
        key => !(key in nextProps) || isNew(prevProps, nextProps)(key)
      )
      .forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
      });
    
    // remove old properties
    Object.keys(prevProps)
      .filter(isProperty)
      .filter(isGone(prevProps, nextProps))
      .forEach(name => {
        dom[name] = '';
      });
    
    // set new or changed properties
    Object.keys(nextProps)
      .filter(isProperty)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        dom[name] = nextProps[name];
      });
    
    // add event listeners
    Object.keys(nextProps)
      .filter(isEvent)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
      });
  }

  function reconcileChildren(wipFiber, elements) {
    let index = 0;
    let oldFiber = wipFiber.alternate?.child;
    let prevSibling = null;

    while (index < elements.length || oldFiber?.type) {
      const element = elements[index];
      let newFiber = null;

      const sameType = element?.type == oldFiber?.type;

      if (sameType) {
        newFiber = {
          type: oldFiber.type,
          props: element.props,
          dom: oldFiber.dom,
          return: wipFiber,
          effectTag: 'UPDATE',
        }
      }

      if (element && !sameType) {
        newFiber = {
          type: element.type,
          props: element.prop,
          dom: null,
          return: wipFiber,
          alternate: null,
          effectTag: 'PLACEMENT',
        }
      }

      if (oldFiber && !sameType) {
        oldFiber.effectTag = 'DELETION';
        deletions.push(oldFiber);
      }

      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }

      if (index === 0) {
        wipFiber.child = newFiber;
      } else if (element) {
        prevSibling.sibling = newFiber;
      }

      prevSibling = newFiber;
      ++index;
    }
  }

  const MiniReact = {
    createElement,
  };

  window.MiniReact = MiniReact;
})();
