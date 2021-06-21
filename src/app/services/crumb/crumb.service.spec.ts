import { CrumbService } from '@app/services/crumb/crumb.service';

describe('CrumbService', () => {
  let service;

  beforeEach(() => {
    service = new CrumbService();
  });

  it('should update crumbs', (done) => {
    service.setCrumbs([
      { title: 'First', link: '/first' },
      { title: 'Second', link: '/second' },
      { title: 'Third', link: '/third' },
    ]);

    service.getCrumbs().subscribe((e) => {
      expect(e).toEqual([
        { title: 'First', link: '/first' },
        { title: 'Second', link: '/second' },
        { title: 'Third' },
      ]);
      done();
    });
  });
});
