import { ModuleSettings } from 'src/module-settings';

import { Foundry } from '../libraries/foundry/foundry';

export class Notices {
  constructor(private gameRef: Game, private moduleSettings: ModuleSettings) {}

  public async checkForNotices() {
    if (await this.noticeExistsForCurrentVersion() && !this.noticeForCurrentVersionWasRead()) {
      this.spawnNotice(this.moduleSettings.getVersion());
    } else if (await this.previousNoticeExists() && !this.noticeForPreviousVersionWasRead() && !this.noticeForCurrentVersionWasRead()) {
      this.spawnNotice(this.getPreviousVersion());
    }
  }

  private noticeExistsForCurrentVersion(): boolean {
    return this.noticeExists(this.moduleSettings.getVersion());
  }

  private noticeForCurrentVersionWasRead(): boolean {
    return this.moduleSettings.getListOfReadNoticesVersions().includes(this.moduleSettings.getVersion());
  }

  private previousNoticeExists(): boolean {
    return !!this.getPreviousVersion() && this.noticeExists(this.getPreviousVersion());
  }

  private noticeForPreviousVersionWasRead() {
    return this.moduleSettings.getListOfReadNoticesVersions().includes(this.getPreviousVersion());
  }

  // TODO: Move version utilities in separate class
  private getPreviousVersion(): string {
    // console.log('versions with notices', this.moduleSettings.getVersionsWithNotices())
    const semvers = this.sortSemver(this.moduleSettings.getVersionsWithNotices());
    return semvers.filter(item => item !== this.moduleSettings.getVersion())[0];
  }

  private sortSemver(versionList: Array<string>): Array<string> {
    return versionList.sort(this.compareSemver);
  }

  private compareSemver(a, b) {
    let i, diff;
    const regExStrip0 = /(\.0+)+$/;
    const segmentsA = a.replace(regExStrip0, '').split('.');
    const segmentsB = b.replace(regExStrip0, '').split('.');
    const l = Math.min(segmentsA.length, segmentsB.length);

    for (i = 0; i < l; i++) {
      diff = parseInt(segmentsB[i], 10) - parseInt(segmentsA[i], 10);
      if (diff) {
        return diff;
      }
    }
    return segmentsB.length - segmentsA.length;
  }

  private spawnNotice(version: string) {
    const templatePath = this.getPathOfNotice(version);
    Foundry.renderTemplate(templatePath).then((html: string) => {
      new Dialog({
        title: 'Weather Control Update',
        content: html,
        buttons: {
          yes: {
            icon: '<i class="fas fa-check"></i>',
            label: this.gameRef.i18n.localize('wctrl.notice.Acknowledge'),
            callback: () => this.markNoticeAsSeen()
          }
        },
        default: 'yes',
      }).render(true);
    });
  }

  private markNoticeAsSeen() {
    this.moduleSettings.addVersionToReadNotices(this.moduleSettings.getVersion());
  }

  private noticeExists(version: string): boolean {
    try {
      return Foundry.srcExists(`modules/${this.moduleSettings.getModuleName()}/templates/notices/${version}.html`);
    } catch {
      return false;
    }
  }

  private getPathOfNotice(version: string): string {
    return `modules/${this.moduleSettings.getModuleName()}/templates/notices/${version}.html`;
  }
}
