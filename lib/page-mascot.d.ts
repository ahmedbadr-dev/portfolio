interface MascotOptions {
  directions: string;
  reactions: string;
  size?: number;
  label?: string;
  className?: string;
}

interface MascotInstance {
  destroy: () => void;
}

interface PageMascotApi {
  createMascot: (host: HTMLElement, options: MascotOptions) => MascotInstance;
}

declare const PageMascot: PageMascotApi;
export default PageMascot;
