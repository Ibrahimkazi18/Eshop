import { useEffect, useRef, useState } from "react"
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";

interface Props {
    value : string;
    onChange : (content : string) => void
}

const RichTextEditor = ({ value, onChange } : Props) => {
  const [editorValue, setEditorValue] = useState(value || "");
  const quillRef = useRef(false);
    
  useEffect(() => {
    if(!quillRef.current) {
        quillRef.current = true;

        setTimeout(() => {
            document.querySelectorAll('.ql-toolbar').forEach((toolbar, index) => {
                if (index > 0) toolbar.remove();
            })
        }, 100)
    }
  }, []);

  return (
    <div className="relative">
        
        <ReactQuill 
            theme="snow"
            value={editorValue}
            onChange={(content) => {
                setEditorValue(content);
                onChange(content);
            }}
            modules={{
                toolbar : [
                    [{ font : [] }],                                        // font picker
                    [{ header : [1,2,3,4,5,6,false] }],                     // Headers
                    [{ size : ["small", false, "large", "huge"] }],         // Font Sizes
                    ["bold", "italic", "underline", "strike"],              // Font Styling
                    [{ color : [] }, { background : [] }],                  // font & bg color
                    [{ script : "sub" }, { script : "super" }],             // subcript superscript
                    [{ list : "ordered" }, { list : "bullet" }],            // Lists
                    [{ indent : "-1" }, { indent : "+1" }],                 // Indentation
                    [{ align : [] }],                                       // Text Alignment
                    ["blockquote", "code-block"],                           // blockqoute & code-block
                    ["link", "image", "video"],                             // Insert media
                    ["clean"],                                              // Clear formatting
                ]
            }}
            placeholder="Write a detailed product description here ... "
            className="bg-transparent border border-gray-700 text-white rounded-md"
            style={{
                minHeight: "250px",
            }}
        />

        <style>
        {`
          .ql-toolbar {
            background: transparent;
            border-color: #444;
          }
          .ql-container {
            background: transparent !important;
            border-color: #444 !important;
            color: white;
          }
          .ql-editor {
            min-height: 200px;
            color: white;
          }
          .ql-editor.ql-blank::before {
            color: #aaa !important;
          }
          .ql-picker,
          .ql-picker-label,
          .ql-picker-item,
          .ql-picker-options,
          .ql-stroke {
            color: white !important;
            stroke: white !important;
            border-color: #333 !important;
          }

          .ql-picker,
          .ql-picker-label,
          .ql-picker-options {
            border: none !important;
            box-shadow: none !important;
           }

          .ql-picker-options {
            background-color: black !important;
            border: none !important;
            border-radius: 6px !important;
            box-shadow: none !important;
            padding: 4px !important;
            outline: none !important;
          }

          .ql-picker-item {
            color: white !important;
            padding: 6px 10px !important;
            border-radius: 4px !important;
          }

          .ql-picker-item:hover {
            background-color: #222 !important;
          }
        `}
      </style>
    </div>
  )
}

export default RichTextEditor