import { VersionUtils } from './versionUtils';

describe('VersionUtils', () => {
  it('SHOULD sort versionsfrom more recent to older', () => {
    const firstVersion = '2.1.0';
    const secontVersion = '1.4.2';
    const thirdVersion = '1.0.12';
    expect(VersionUtils.sortSemver([thirdVersion, firstVersion, secontVersion]))
      .toEqual([firstVersion, secontVersion, thirdVersion]);
  });

  it('SHOULD tell if current version is more recent than the other', () =>{
    expect(VersionUtils.isMoreRecent('2.0.0', '1.0.0')).toBeTrue();
    expect(VersionUtils.isMoreRecent('1.1.0', '1.0.0')).toBeTrue();
    expect(VersionUtils.isMoreRecent('1.0.1', '1.0.0')).toBeTrue();
  });

  it('SHOULD tell if current version is older than the other', () => {
    expect(VersionUtils.isMoreRecent('1.0.0', '2.0.0')).toBeFalse();
    expect(VersionUtils.isMoreRecent('1.0.0', '1.1.0')).toBeFalse();
    expect(VersionUtils.isMoreRecent('1.0.0', '1.0.1')).toBeFalse();
  });
});
