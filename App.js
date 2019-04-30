import {createStackNavigator, createAppContainer, createSwitchNavigator} from 'react-navigation';
import  MenuScreen from './screens/MenuScreen';
import EventSetup from './screens/EventSetup';
import MissionSetup from './screens/MissionSetup';
import SortieSetup from './screens/SortieSetup';
import PreMissionScreen from './screens/PreMissionScreen';
import MissionExecutionScreen from './screens/MissionExecutionScreen';
import PostMissionScreen from './screens/PostMissionScreen';
import SummaryScreen from './screens/SummaryScreen';
import LibraryEvents from './screens/LibraryEvents';
import LibraryMissions from './screens/LibraryMissions';
import LibrarySorties from './screens/LibrarySorties';
import SplashScreen from './screens/SplashScreen';

const RootStack = createStackNavigator({
  Home: {screen: MenuScreen},
  EventSetup: {screen: EventSetup},
  MissionSetup: {screen: MissionSetup},
  SortieSetup: {screen: SortieSetup},
  PreMission: {screen: PreMissionScreen},
  MissionExecution: {screen: MissionExecutionScreen},
  PostMission: {screen: PostMissionScreen},
  Summary: {screen: SummaryScreen},
  LibraryEvents: {screen: LibraryEvents},
  LibraryMissions: {screen: LibraryMissions},
  LibrarySorties: {screen: LibrarySorties}
});

console.disableYellowBox = true;

const InitialNavigator = createSwitchNavigator({
  Splash: SplashScreen,
  App: RootStack
});

export default createAppContainer(InitialNavigator);

// const App = createAppContainer(InitialNavigator);
//
// export default App;