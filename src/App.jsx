// 主应用组件

import React from 'react';
import { GameProvider, useGame } from './logic/gameState';
import StatsSidebar from './components/StatsSidebar';
import MainStage from './components/MainStage';
import InitScreen from './components/InitScreen';
import RulesScreen from './components/RulesScreen';
import ReviewScreen from './components/ReviewScreen';
import ModelScreen from './components/ModelScreen';
import ShopScreen from './components/ShopScreen';
import ChoiceScreen from './components/ChoiceScreen';
import EndingScreen from './components/EndingScreen';
import EventModal from './components/EventModal';
import JobScreen from './components/JobScreen';
import DefenseScreen from './components/DefenseScreen';
import TutorDrawScreen from './components/TutorDrawScreen';
import './App.css';

function GameContent() {
  const { state } = useGame();
  const { screen } = state.ui;

  // 初始化界面
  if (!state.initialized) {
    return <InitScreen />;
  }

  // 规则说明界面
  if (screen === 'rules') {
    return <RulesScreen />;
  }

  // 结局界面
  if (screen === 'ending') {
    return <EndingScreen />;
  }

  // 主游戏界面
  return (
    <div className="app-container">
      <StatsSidebar />

      {/* 根据当前屏幕渲染不同内容 */}
      {screen === 'game' && <MainStage />}
      {screen === 'review' && (
        <div className="main-stage">
          <ReviewScreen />
        </div>
      )}
      {screen === 'model' && (
        <div className="main-stage">
          <ModelScreen />
        </div>
      )}
      {screen === 'shop' && (
        <div className="main-stage">
          <ShopScreen />
        </div>
      )}
      {screen === 'job' && (
        <div className="main-stage">
          <JobScreen />
        </div>
      )}
      {screen === 'choice' && (
        <div className="main-stage">
          <ChoiceScreen />
        </div>
      )}
      {screen === 'defense' && (
        <div className="main-stage">
          <DefenseScreen />
        </div>
      )}
      {screen === 'tutorDraw' && (
        <div className="main-stage">
          <TutorDrawScreen />
        </div>
      )}

      {/* 事件弹窗 */}
      <EventModal />
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
