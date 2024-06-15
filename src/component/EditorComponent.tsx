import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, Modifier, getDefaultKeyBinding, KeyBindingUtil, ContentBlock, DraftDecoratorType, EditorProps, CompositeDecorator, DraftHandleValue } from 'draft-js';
import 'draft-js/dist/Draft.css';

// Custom style map for inline styles
const styleMap = {
  'red-line': {
    color: 'red',
  },
  'UNDERLINE': {
    textDecoration: 'underline',
  },
};

// Custom block rendering function to handle CODE block type
const blockStyleFn = (contentBlock: ContentBlock) => {
  const type = contentBlock.getType();
  if (type === 'CODE') {
    return 'code-block-style';
  }if (type === 'HEADER') {
    return 'header';
  }
  return '';
};

// Custom CSS for the code block
const customCSS = `
  .code-block-style {
    background-color: yellow;
    color: blue;
    padding: 2px;
  },
  .header{
    font-size: 40px;
    font-weight: bold;
  }
`;

// Inject custom CSS into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = customCSS;
document.head.appendChild(styleSheet);

const MyEditor: React.FC = () => {
  const [editorState, setEditorState] = useState<EditorState>(() => {
    const savedData = localStorage.getItem('editorContent');
    return savedData ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedData))) : EditorState.createEmpty();
  });

  const handleKeyCommand = (command: string, editorState: EditorState): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleBeforeInput = (input: string): DraftHandleValue => {
    const currentContent = editorState.getCurrentContent();
    const currentSelection = editorState.getSelection();
    const blockKey = currentSelection.getStartKey();
    const block = currentContent.getBlockForKey(blockKey);
    const blockText = block.getText();
    const blockType = block.getType();

    if (blockType === 'unstyled') {
      if (blockText === '#' && input === ' ') {
        applyBlockType('HEADER', 1);
        return 'handled';
      }
      if (blockText === '*' && input === ' ') {
        applyInlineStyle('BOLD', 1);
        return 'handled';
      }
      if (blockText === '**' && input === ' ') {
        applyInlineStyle('red-line', 2);
        return 'handled';
      }
      if (blockText === '***' && input === ' ') {
        applyInlineStyle('UNDERLINE', 3);
        return 'handled';
      }
      if (blockText === '```' && input === ' ') {
        applyBlockType('CODE', 3);
        return 'handled';
      }
    }
    return 'not-handled';
  };

  const applyBlockType = (blockType: string, length: number) => {
    const currentContent = editorState.getCurrentContent();
    const currentSelection = editorState.getSelection();
    const newContentState = Modifier.removeRange(
      currentContent,
      currentSelection.merge({
        anchorOffset: 0,
        focusOffset: length,
      }),
      'backward'
    );
    const newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
    setEditorState(RichUtils.toggleBlockType(newEditorState, blockType));
  };

  const applyInlineStyle = (inlineStyle: string, length: number) => {
    const currentContent = editorState.getCurrentContent();
    const currentSelection = editorState.getSelection();
    const newContentState = Modifier.removeRange(
      currentContent,
      currentSelection.merge({
        anchorOffset: 0,
        focusOffset: length,
      }),
      'backward'
    );
    const newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
    setEditorState(RichUtils.toggleInlineStyle(newEditorState, inlineStyle));
  };

  const saveContent = () => {
    const content = editorState.getCurrentContent();
    localStorage.setItem('editorContent', JSON.stringify(convertToRaw(content)));
  };

  useEffect(() => {
    const savedData = localStorage.getItem('editorContent');
    if (savedData) {
      setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(savedData))));
    }
  }, []);

  return (
    <div>
      <input type="text" placeholder="Title" style={{ display: 'block', width: '100%', padding: '10px', fontSize: '20px', marginBottom: '10px' }} />
      <button onClick={saveContent} style={{ marginBottom: '10px', padding: '10px' }}>Save</button>
      <div style={{ border: '1px solid #ccc', padding: '10px' }}>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={styleMap}
          blockStyleFn={blockStyleFn}
        />
      </div>
    </div>
  );
};

export default MyEditor;
