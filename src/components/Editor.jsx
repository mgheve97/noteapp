
import { useEffect, useState } from "react";
import ReactMde from "react-mde";
import showdown from "showdown";
import 'react-mde/lib/styles/css/react-mde-all.css';

export default function Editor({tempNoteText, settempNoteText}){
    const [selectedTab, setselectedTab] = useState("write")

    /* Converting Markdown to Html */
    /* showdown.converter() */
    const converter = new showdown.Converter({
        tables: true, /* Allowing Table to be use*/
        simplifiedAutoLink: true, /* Allowing urls to be clickable links*/
        strikethrough: true, /* Allowing strikethrough to be use*/
        tasklist: true, /* Allowing checkboxes*/
    })
    
    return(
        <section className="pane editor">
            <ReactMde 
                value={tempNoteText}
                onChange={settempNoteText}
                selectedTab={selectedTab}
                onTabChange={setselectedTab}
                generateMarkdownPreview={(markdown) =>
                    Promise.resolve(converter.makeHtml(markdown))
                }
                minEditorHeight={80}
                heightUnits="vh"
            />
        </section>
    )
}