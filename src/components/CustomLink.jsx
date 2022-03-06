import { useResolvedPath, useMatch, Link } from "react-router-dom";

export const CustomLink = ({ children, to, ...props }) => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname });
  console.log(resolved);

  return (
    <div>
      <Link to={`../${to}`} className={match ? "custom-link--active" : "custom-link"} {...props}>
        {children}
      </Link>

      {match && "Match"}
    </div>
  );
};
