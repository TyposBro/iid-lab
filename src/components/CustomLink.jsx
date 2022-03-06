import { useMatch, Link, useResolvedPath } from "react-router-dom";

export const CustomLink = ({ children, className, to, ...props }) => {
  const loc = useResolvedPath(`../${to}`);
  const match = useMatch({ path: loc.pathname, end: true });
  console.log(loc);

  return (
    <Link to={`../${to}`} className={match ? className + " custom-link--active" : className} {...props}>
      {children}
    </Link>
  );
};
