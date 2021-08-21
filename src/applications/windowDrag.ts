export class WindowDrag {
  private parent: HTMLElement;
  private mouseMoveCallback = (moveEvent: Event) => {
    this.mouseMove(moveEvent);
  }


  public start(parent: HTMLElement) {
    this.parent = parent;

    document.addEventListener('mousemove', this.mouseMoveCallback);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', this.mouseMoveCallback);
    });
  }

  private mouseMove(event: Partial<MouseEvent>) {
    this.parent.style.top = event.clientY + (event.clientY - this.parent.offsetTop) + 'px';
    this.parent.style.left = event.clientX + (event.clientX - this.parent.offsetLeft) + 'px';
    this.parent.style.position = 'fixed';
    this.parent.style.zIndex = '100';
  }
}
