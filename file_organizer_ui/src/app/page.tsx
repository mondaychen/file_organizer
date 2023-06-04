import Main from './components/Main';

interface CustomWindow extends Window {
  __FILE_ORGANIZER__?: {
    API_LIST_DIR: string;
    WS_URL: string;
  };
}

declare const window: CustomWindow;

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col justify-items-stretch px-6 py-4">
      <h1 className='text-2xl font-semibold py-4 logo leading-10'>File Orangizer</h1>
      <Main />
    </div>
  )
}
