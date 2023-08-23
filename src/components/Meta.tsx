import { createPortal } from 'react-dom';

export const Meta = ({ Component }) => {
  return createPortal(<Component />, document.head);
};

export const DefaultMeta = () => {
  return (
    <>
      <title>React Server + Vite + React + TS</title>
      <meta
        name="description"
        content="React Server is a new framework that allows you to build serverside components using JSX/TSX along with a reactive coding style known from the frontend library React. (components, hooks, effects etc.)"
      />
      <meta
        name="keywords"
        content="React Server, serverside components, serverside react components, React, GraphQL,full stack, fullstack framework, JS, JavaScript, TypeScript, reactive programming, declarative programming, "
      />
      <link rel="canonical" href="https://lists.state-less.cloud" />
      <meta
        property="og:title"
        content="Lists App - Organize Your Life with Productivity in Mind"
      />
      <meta
        property="og:description"
        content="React Server is a new framework that allows you to build serverside components using JSX/TSX along with a reactive coding style known from the frontend library React. (components, hooks, effects etc.)"
      />
      <meta
        property="og:image"
        content="https://state-less.cloud/react-server.png"
      />
      <meta property="og:url" content="https://state-less.cloud/lists" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Lists App - Organize Your Life with Productivity in Mind"
      />
      <meta
        name="twitter:description"
        content="React Server is a new framework that allows you to build serverside components using JSX/TSX along with a reactive coding style known from the frontend library React. (components, hooks, effects etc.)"
      />
      <meta
        name="twitter:image"
        content="https://state-less.cloud/react-server.png"
      />
    </>
  );
};

export const ListsMeta = () => {
  return (
    <>
      <meta />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Lists App - Organize Your Life with Productivity in Mind</title>
      <meta
        name="description"
        content="Boost your productivity with Lists, the ultimate web app to organize your tasks, track your daily water intake, manage expenses, and achieve your goals efficiently. Stay motivated with our unique gamification feature and earn points as you conquer your to-do list. Sign up now and embark on a journey to a more organized and fulfilling life."
      />
      <meta
        name="keywords"
        content="Lists app, productivity app, task management, water intake tracker, expense tracker, productivity tool, gamification, organization, to-do list"
      />
      <link rel="canonical" href="https://lists.state-less.cloud" />
      <meta
        property="og:title"
        content="Lists App - Organize Your Life with Productivity in Mind"
      />
      <meta
        property="og:description"
        content="Boost your productivity with Lists, the ultimate web app to organize your tasks, track your daily water intake, manage expenses, and achieve your goals efficiently. Stay motivated with our unique gamification feature and earn points as you conquer your to-do list. Sign up now and embark on a journey to a more organized and fulfilling life."
      />
      <meta
        property="og:image"
        content="https://state-less.cloud/react-server.png"
      />
      <meta property="og:url" content="https://state-less.cloud/lists" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Lists App - Organize Your Life with Productivity in Mind"
      />
      <meta
        name="twitter:description"
        content="Boost your productivity with Lists, the ultimate web app to organize your tasks, track your daily water intake, manage expenses, and achieve your goals efficiently. Stay motivated with our unique gamification feature and earn points as you conquer your to-do list. Sign up now and embark on a journey to a more organized and fulfilling life."
      />
      <meta
        name="twitter:image"
        content="https://state-less.cloud/react-server.png"
      />
    </>
  );
};
