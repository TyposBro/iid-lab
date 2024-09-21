import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PropTypes from "prop-types";

const Markdown = ({ markdown }) => {
  return (
    <div className="w-full">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
};

Markdown.propTypes = {
  markdown: PropTypes.string.isRequired,
};

export default Markdown;
