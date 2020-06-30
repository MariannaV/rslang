import { SIDEBAR, MAIN, HEADER } from 'scripts/helpers/variables';
import { pageHomeCreate } from 'pages/main';
import { store } from 'store';
import { createSidebar } from './burger';
import { Header } from './Header';
import { Authorization } from './Authorization';
import { router } from '../routes';

export class App {
  static reRender(page) {
    const isAuthPage = ['login', 'registration'].includes(page);
    const isAuthorized = !!store.user.auth.token;
    if (isAuthPage) {
      if (isAuthorized) return router.navigate('/');
      SIDEBAR.innerHTML = '';
      HEADER.innerHTML = '';
    } else {
      this.checkSideBar();
      this.checkHeader();
    }
    MAIN.innerHTML = '';
    this.setContent(page);
  }

  static checkSideBar() {
    if (!SIDEBAR.innerHTML) {
      createSidebar();
    }
  }

  static checkHeader() {
    if (!HEADER.innerHTML) {
      Header.render();
    }
  }

  static setContent(content) {
    switch (content) {
      case '/': {
        pageHomeCreate()
        break
      }
      case 'login':
      case 'registration':
        Authorization.render(content);
        break;
      case 'learn':
        MAIN.innerHTML = '<div>learn</div>'; // replace with function that render page learn words
        break;
      case 'progress':
        MAIN.innerHTML = '<div>progress</div>'; // replace with function that render progress page
        break;
      case 'dictionary':
        MAIN.innerHTML = '<div>dictionary</div>'; // replace with function that render dictionary page
        break;
      case 'speakIt':
        MAIN.innerHTML = '<div>speakIt</div>'; // replace with function that render speakIt mini-game page
        break;
      case 'puzzle':
        MAIN.innerHTML = '<div>puzzle</div>'; // replace with function that render puzzle mini-game page
        break;
      case 'savannah':
        MAIN.innerHTML = '<div>savannah</div>'; // replace with function that render savannah mini-game page
        break;
      case 'audioCall':
        MAIN.innerHTML = '<div>audioCall</div>'; // replace with function that render audioCall mini-game page
        break;
      case 'sprint':
        MAIN.innerHTML = '<div>sprint</div>'; // replace with function that render sprint mini-game page
        break;
      case 'ourGame':
        MAIN.innerHTML = '<div>ourGame</div>'; // replace with function that render ourGame mini-game page
        break;
      case 'promo':
        MAIN.innerHTML = '<div>promo</div>'; // replace with function that render promo page
        break;
      case 'aboutUs':
        MAIN.innerHTML = '<div>aboutUs</div>'; // replace with function that render aboutUs page
        break;
      default:
        break;
    }
  }
}
