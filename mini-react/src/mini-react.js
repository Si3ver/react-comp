(function() {
  // ------------------------ jsxFactory: createElement ------------------------
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

  // ------------------------ 1️⃣ render（reconcile） 阶段 ------------------------

  let nextUnitOfWork = null; // 下一个要处理的 fiber 节点
  let wipRoot = null; // 处理中(work in progress)的 fiber 链表的根节点
  let currentRoot = null; // 旧的 fiber 链表根节点
  let deletions = null; // 要删除的节点列表

  // 入口
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

    if (!nextUnitOfWork && wipRoot) {
      commitRoot();
    }

    requestIdleCallback(workLoop);
  }

  requestIdleCallback(workLoop);

  // 按 child -> sibling -> return 的顺序逐个处理 fiber 节点
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

  // 函数组件的处理：
  function updateFunctionComponent(fiber) {
    wipFiber = fiber;

    stateHookIndex = 0;

    wipFiber.stateHooks = [];  // 存储 useState 的 hook 的值
    wipFiber.effectHooks = []; // 存储 useEffect 的 hook 的值

    console.log('返回结果：', fiber.type(fiber.props));

    const children = [fiber.type(fiber.props)];
    reconcileChildren(fiber, children);
  }

  // 浏览器原生标签的处理：
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

  // 更新 dom: 删除旧事件、属性，添加新事件、属性
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
      .forEach((name) => {
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

  // 处理 fiber 的子元素
  function reconcileChildren(wipFiber, elements) {
    let index = 0;
    let oldFiber = wipFiber.alternate?.child; // alternate 指向旧 fiber 节点
    let prevSibling = null;

    while (index < elements.length || oldFiber?.type) { // ! oldFiber != null
      const element = elements[index];
      let newFiber = null;

      // diff
      const sameType = element?.type == oldFiber?.type;

      // 1️⃣ 节点类型 type 相同: UPDATE
      if (sameType) {
        newFiber = {
          type: oldFiber.type,
          props: element.props,
          dom: oldFiber.dom,
          return: wipFiber,
          alternate: oldFiber, // !! alternate
          effectTag: 'UPDATE',
        }
      }

      // 2️⃣ 存在新 fiber: PLACEMENT(替换)
      if (element && !sameType) {
        newFiber = {
          type: element.type,
          props: element.props, // !! props
          dom: null,
          return: wipFiber,
          alternate: null,
          effectTag: 'PLACEMENT',
        }
      }

      // 3️⃣ 存在旧 fiber（有 -> 无）: DELETION(删除)
      if (oldFiber && !sameType) {
        oldFiber.effectTag = 'DELETION';
        deletions.push(oldFiber);
      }

      // oldFiber 指针更新为下一个兄弟节点 // !!
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

  // ------------------------ 2️⃣ commit 阶段 ------------------------
  // 当我们将整棵树遍历成Fiber后，就可以进入commit阶段
  function commitRoot() {
    // debugger;
    deletions.forEach(commitWork);
    // div#root本事已经存在，所以从child开始
    commitWork(wipRoot.child);
    commitEffectHooks();
    currentRoot = wipRoot;
    wipRoot = null;
  }

  function commitWork(fiber) {
    if (!fiber) {
      return;
    }

    // 拿到当前处理Fiber的父标签
    let domParentFiber = fiber.return;
    // 假如当前的fiber的父级是App组件，App Fiber并不代表真实的DOM。而应该是上一级的div#root，通过一个循环找到最近的父级
    while (!domParentFiber.dom) {
      domParentFiber = domParentFiber.return;
    }
    // 拿到父级DOM
    const domParent = domParentFiber.dom;

    // 处理 fiber 对应的 effect
    if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
      domParent.appendChild(fiber.dom); // 1️⃣ placement -> appendChild(fiber.dom)
    } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
      updateDom(fiber.dom, fiber.alternate.props, fiber.props); // 2️⃣ update -> 修改 dom & event listeners
    } else if (fiber.effectTag === 'DELETION') {
      commitDeletion(fiber, domParent); // 3️⃣ delete -> removeChild
    }

    commitWork(fiber.child);
    commitWork(fiber.sibling);
  }

  function commitDeletion(fiber, domParent) {
    if (fiber.dom) {
      domParent.removeChild(fiber.dom);
    } else {
      commitDeletion(fiber.child, domParent);
    }
  }

  function isDepsEqual(deps, newDeps) {
    if (deps.length !== newDeps.length) {
      return false;
    }

    for (let i = 0; i < deps.length; i++) {
      if (deps[i] !== newDeps[i]) {
        return false;
      }
    }
    return true;
  }

  // ------------------------ [hook] useState ------------------------
  function useState(initialState) {
    const currentFiber = wipFiber;

    const oldHook = wipFiber.alternate?.stateHooks[stateHookIndex];

    const stateHook = {
      state: oldHook ? oldHook.state : initialState,
      queue: oldHook ? oldHook.queue : [],
    };

    stateHook.queue.forEach((action) => {
      stateHook.state = action(stateHook.state);
    });

    stateHook.queue = [];

    stateHookIndex++;
    wipFiber.stateHooks.push(stateHook);

    function setState(action) {
      const isFunction = typeof action === 'function';

      stateHook.queue.push(isFunction ? action : () => action);

      wipRoot = {
        ...currentFiber,
        alternate: currentFiber,
      };
      nextUnitOfWork = wipRoot;
    }

    return [stateHook.state, setState];
  }

  // ------------------------ [hook] useEffect ------------------------
  function useEffect(callback, deps) {
    const effectHook = {
      callback,
      deps,
      cleanup: undefined,
    };
    wipFiber.effectHooks.push(effectHook);
  }

  function commitEffectHooks() {
    function runCleanup(fiber) {
      if (!fiber) return;

      fiber.alternate?.effectHooks?.forEach((hook, index) => {
        const deps = fiber.effectHooks[index].deps;

        if (!hook.deps || !isDepsEqual(hook.deps, deps)) {
          hook.cleanup?.();
        }
      });

      runCleanup(fiber.child);
      runCleanup(fiber.sibling);
    }

    function run(fiber) {
      if (!fiber) return;

      fiber.effectHooks?.forEach((newHook, index) => {
        if (!fiber.alternate) {
          newHook.cleanup = newHook.callback();
          return;
        }

        if (!newHook.deps) {
          newHook.cleanup = newHook.callback();
        }

        if (newHook.deps.length > 0) {
          const oldHook = fiber.alternate?.effectHooks[index];

          if (!isDepsEqual(oldHook.deps, newHook.deps)) {
            newHook.cleanup = newHook.callback();
          }
        }
      });

      run(fiber.child);
      run(fiber.sibling);
    }

    runCleanup(wipRoot); // 先清理
    run(wipRoot); // 再调用
  }

  const MiniReact = {
    createElement,
    render,
    useState,
    useEffect,
  };

  window.MiniReact = MiniReact;
})();
