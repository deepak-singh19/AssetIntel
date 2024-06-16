import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, Modifier, ContentBlock, DraftHandleValue } from 'draft-js';
import 'draft-js/dist/Draft.css';
import '../App.css'; // Import the CSS file

// Custom style map for inline styles
const styleMap = {
  'red-line': {
    color: 'red',
  },
  'UNDERLINE': {
    textDecoration: 'underline',
  },
};

// Custom block rendering function to handle CODE and HEADER block types
const blockStyleFn = (contentBlock: ContentBlock) => {
  const type = contentBlock.getType();
  if (type === 'CODE') {
    return 'code-block-style';
  }
  if (type === 'header-one') {
    return 'header';
  }
  return '';
};

const MyEditor: React.FC = () => {
  const [editorState, setEditorState] = useState<EditorState>(() => {
    const savedData = localStorage.getItem('editorContent');
    return savedData ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedData))) : EditorState.createEmpty();
  });

  const [title, setTitle] = useState<string>(() => {
    return localStorage.getItem('editorTitle') || '';
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
        applyBlockType('header-one', 1);
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
    localStorage.setItem('editorTitle', title);
  };

  useEffect(() => {
    const savedData = localStorage.getItem('editorContent');
    const savedTitle = localStorage.getItem('editorTitle');
    if (savedData) {
      setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(savedData))));
    }
    if (savedTitle) {
      setTitle(savedTitle);
    }
  }, []);

  const handleEditorChange = (newState: EditorState) => {
    setEditorState(newState);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div className="my-editor w-full h-full flex flex-col justify-center items-center">
      <div className='w-full h-[20%] flex'>
        <div className='flex w-[80%] justify-center items-center'>
          <input 
            type="text" 
            value={title} 
            onChange={handleTitleChange} 
            placeholder="Title" 
            className='my-[10px] text-center border-2 border-slate-400'
          />
        </div>
        <div className='flex w-[20%] justify-end items-center'>
          <button onClick={saveContent} className='border-2 border-slate-400 text-[20px] py-[10px] px-[20px] rounded-xl '>Save</button>
        </div>
      </div>
      <div className="editorContainer w-full h-[75%]">
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={handleEditorChange}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={styleMap}
          blockStyleFn={blockStyleFn}
        />
      </div>
    </div>
  );
};

export default MyEditor;
