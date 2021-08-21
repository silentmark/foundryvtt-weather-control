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
    this.parent.style.top = this.parent.offsetTop + event.movementY + 'px';
    this.parent.style.left = this.parent.offsetLeft + event.movementX + 'px';
    this.parent.style.position = 'fixed';
    this.parent.style.zIndex = '100';
  }
}
