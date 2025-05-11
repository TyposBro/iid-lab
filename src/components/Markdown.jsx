import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PropTypes from "prop-types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"; // Or use LightAsync for lazy loading
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism"; // Choose a style

const Markdown = ({ markdown }) => {
  return (
    <div className="w-full text-text_black_secondary text-sm break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={darcula} // Choose your theme
                language={match[1]}
                PreTag="div" // Use div instead of pre to avoid double pre tags if GFM also adds one
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

Markdown.propTypes = {
  markdown: PropTypes.string.isRequired,
};

export default Markdown;
