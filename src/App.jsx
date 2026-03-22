// 主应用组件

import React, { useState } from 'react';
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
import ReviewFlowScreen from './components/ReviewFlowScreen';
import TutorDrawScreen from './components/TutorDrawScreen';
import PortfolioScreen from './components/PortfolioScreen';
import CompetitionScreen from './components/CompetitionScreen';
import PostgradScreen from './components/PostgradScreen';
import StudyAbroadScreen from './components/StudyAbroadScreen';
import InternScreen from './components/InternScreen';
import CareerScreen from './components/CareerScreen';
import ExamGradScreen from './components/ExamGradScreen';
import ExamCivilScreen from './components/ExamCivilScreen';
import AtlasScreen from './components/AtlasScreen';
import SpotlightTour from './components/SpotlightTour';
import { useAchievementTracker } from './hooks/useAchievementTracker';
import { useIsMobile } from './hooks/useIsMobile';
import MobileHeader from './components/mobile/MobileHeader';
import MobileDrawer from './components/mobile/MobileDrawer';
import MobileActionBar from './components/mobile/MobileActionBar';
import './App.css';

function GameContent() {
  const { state, dispatch } = useGame();
  useAchievementTracker(state);
  const isMobile = useIsMobile();
  const { screen } = state.ui;
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  // ===== 移动端布局 =====
  if (isMobile) {
    return (
      <div className="app-container-mobile">
        <MobileHeader onMenuToggle={() => setDrawerOpen(!drawerOpen)} highlightMenu={!!state.gameTip} />
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        {/* 主内容区 */}
        <div className="mobile-content">
          {screen === 'game' && <MainStage isMobile />}
          {screen === 'review' && <ReviewScreen />}
          {screen === 'model' && <ModelScreen />}
          {screen === 'shop' && <ShopScreen />}
          {screen === 'job' && <JobScreen />}
          {screen === 'choice' && <ChoiceScreen />}
          {screen === 'defense' && <DefenseScreen />}
          {screen === 'reviewFlow' && <ReviewFlowScreen />}
          {screen === 'tutorDraw' && <TutorDrawScreen />}
          {screen === 'portfolio' && <PortfolioScreen />}
          {screen === 'competitions' && <CompetitionScreen />}
          {screen === 'postgrad' && <PostgradScreen />}
          {screen === 'studyAbroad' && <StudyAbroadScreen />}
          {screen === 'internship' && <InternScreen />}
          {screen === 'jobSearch' && <CareerScreen />}
          {screen === 'examGrad' && <ExamGradScreen />}
          {screen === 'examCivil' && <ExamCivilScreen />}
          {screen === 'atlas' && <AtlasScreen />}
        </div>

        {/* 游戏主界面显示底部行动栏 */}
        {screen === 'game' && <MobileActionBar />}

        {/* 事件弹窗 */}
        <EventModal />

        {/* 新手指引 */}
        {state.tutorialActive && (
          <SpotlightTour onComplete={() => dispatch({ type: 'TOGGLE_TUTORIAL', payload: false })} />
        )}
      </div>
    );
  }

  // ===== 桌面端布局（原有 — 不改动） =====
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
      {screen === 'reviewFlow' && (
        <div className="main-stage">
          <ReviewFlowScreen />
        </div>
      )}
      {screen === 'tutorDraw' && (
        <div className="main-stage">
          <TutorDrawScreen />
        </div>
      )}
      {screen === 'portfolio' && (
        <div className="main-stage" style={{ padding: 0 }}>
          <PortfolioScreen />
        </div>
      )}

      {/* 毕业选项分流界面组 */}
      {screen === 'competitions' && <div className="main-stage"><CompetitionScreen /></div>}
      {screen === 'postgrad' && <div className="main-stage"><PostgradScreen /></div>}
      {screen === 'studyAbroad' && <div className="main-stage"><StudyAbroadScreen /></div>}
      {screen === 'internship' && <div className="main-stage"><InternScreen /></div>}
      {screen === 'jobSearch' && <div className="main-stage"><CareerScreen /></div>}
      {screen === 'examGrad' && <div className="main-stage"><ExamGradScreen /></div>}
      {screen === 'examCivil' && <div className="main-stage"><ExamCivilScreen /></div>}
      {screen === 'atlas' && <div className="main-stage"><AtlasScreen /></div>}

      {/* 事件弹窗 */}
      <EventModal />

      {/* 新手指引全屏遮罩 */}
      {state.tutorialActive && (
        <SpotlightTour onComplete={() => dispatch({ type: 'TOGGLE_TUTORIAL', payload: false })} />
      )}
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
