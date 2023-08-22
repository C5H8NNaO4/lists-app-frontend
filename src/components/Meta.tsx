import { createPortal } from 'react-dom';

export const Meta = ({ Component }) => {
  return createPortal(<Component />, document.head);
};

export const DefaultMeta = () => {
  return (
    <>
      <title>React Server + Vite + React + TS</title>
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
      <link rel="canonical" href="https://www.lists-productivity.com" />
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
        content="https://www.lists-productivity.com/images/og-image.jpg"
      />
      <meta property="og:url" content="https://www.lists-productivity.com" />
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
        content="https://www.lists-productivity.com/images/twitter-card-image.jpg"
      />
    </>
  );
};
