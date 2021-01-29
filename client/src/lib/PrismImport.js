import Prism from "prismjs";
// Include the toolbar languages
import "prismjs/themes/prism.css";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-diff";
import "prismjs/components/prism-python";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-xml-doc";
import "prismjs/components/prism-java";
import "prismjs/components/prism-php";
// Include the toolbar plugin: (optional)
import "prismjs/plugins/toolbar/prism-toolbar";
import "prismjs/plugins/toolbar/prism-toolbar.css";
// Include some other plugins: (optional)
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard";
import "prismjs/plugins/show-language/prism-show-language";

function PrismImport() {
	return(Prism.highlightAll());
}

export default PrismImport;