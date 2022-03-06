import { Link, useResolvedPath, useMatch } from "react-router-dom";

export const CustomLink = ({ children, to, ...props }) => {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <div>
      <Link className={match ? "custom-link--active" : "custom-link"} to={to} {...props}>
        {children}
      </Link>
    </div>
  );
};
