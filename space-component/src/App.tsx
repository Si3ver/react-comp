import Space from './Space';
import { ConfigContext } from './Space/ConfigProvider';
import './App.css';

export default function App() {
  return <div>
    <ConfigContext.Provider value={{ space: { size: 4 } }}>
      <Space direction='horizontal' size="large" style={{background: 'green'}} align='end' wrap={true}>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </Space>

      <Space split={<div className="box" style={{background: 'yellow'}}></div>}>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </Space>

      <Space direction='vertical' size="small">
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </Space>
    </ConfigContext.Provider>
  </div>
}
