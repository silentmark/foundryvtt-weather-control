/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class WarningSystem {
  static validateAboutTime() {
    let aboutTime;
    if (game.data.version === '0.5.1') {
      aboutTime = (game.modules as any).find(module => module.id === 'about-time' && module.active);
    } else {
      aboutTime = game.modules.get('about-time') && game.modules.get('about-time').active as any;
    }
    if (!aboutTime && game.user.isGM) {
      return WarningSystem.generateDialog();
    }
  }

  static generateDialog() {
    new Dialog({
      title: game.i18n.localize('wctrl.misc.AboutTimeMissing'),
      content: game.i18n.localize('wctrl.misc.AboutTimeMissingHelp'),
      buttons: {
        one: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('wctrl.misc.AboutTimeGitlab'),
          callback: () => window.open('https://gitlab.com/tposney/about-time/-/tree/master/src', '_blank', 'fullscreen=no')
        },
        two: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('wctrl.misc.Disregard'),
          callback: () => { return; }
        }
      },
      default: 'two',
      close: () => { return; }
    }).render(true);
  }
}
