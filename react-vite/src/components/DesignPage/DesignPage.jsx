import DesignEditor from "../DesignEditor/DesignEditor";
import "./DesignPage.css";


/** DesignPage Component
 * Top level container for t-shirt design experience.
 * handles routing, auth, loads existing data if editing 
 * 
 */

function DesignPage() {
    return (
        <div className="design-page-root">
            <DesignEditor />
        </div>
    );
}

export default DesignPage;