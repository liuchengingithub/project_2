import { useState } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useEffect } from 'react';

const Edit = ({ getContent, content }) => {
    const [editorState, setEditorState] = useState('')
    useEffect(() => {
        const html = content
        if(html === undefined) return;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            setEditorState(EditorState.createWithContent(contentState))
        }},[content])
    return (
        <div>
            <Editor
                editorState={editorState}
                onEditorStateChange={(editorState) => {
                    setEditorState(editorState)
                }}
                onBlur={() => {
                    getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    )
}

export default Edit;