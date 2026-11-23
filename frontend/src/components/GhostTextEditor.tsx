
import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { GhostTextExtension, ghostKey } from "../extensions/GhostTextExtension";
import { getSuggestion } from "../services/aiService";

export default function GhostTextEditor() {
  const [status, setStatus] = useState("Ready");
  const requestId = useRef(0);

  const editor = useEditor({
    extensions: [StarterKit, GhostTextExtension],
    content: "<p></p>",
    editorProps: {
      attributes: { class: "ghost-editor" },
    },
  });

  useEffect(() => {
    if (!editor) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;

    const update = () => {
      requestId.current++;
      const currentId = requestId.current;

      clearTimeout(timer);
      controller?.abort();

      const state = editor.state;
      const selection = state.selection;
      const ghost = ghostKey.getState(state);

      // Keep a dismissed suggestion hidden until the user edits.
      if (ghost?.dismissed) {
        setStatus("Suggestion dismissed");
        return;
      }

      if (
        !selection.empty ||
        !selection.$from.parent.isTextblock ||
        !editor.isFocused
      ) {
        setStatus("Ready");
        return;
      }

      const text = selection.$from.parent.textBetween(
        0,
        selection.$from.parentOffset
      );

      if (text.trim().length < 3) {
        setStatus("Ready");
        return;
      }

      const position = selection.from;

      setStatus("Waiting for input...");

      timer = setTimeout(async () => {
        controller = new AbortController();
        setStatus("Generating suggestion...");

        try {
          const suggestion = await getSuggestion(
            text,
            controller.signal
          );

          if (
            currentId !== requestId.current ||
            editor.state.selection.from !== position ||
            !editor.state.selection.empty ||
            !editor.isFocused
          ) {
            return;
          }

          if (ghostKey.getState(editor.state)?.dismissed) {
            return;
          }

          editor.view.dispatch(
            editor.state.tr.setMeta(ghostKey, {
              type: "set",
              suggestion,
              position,
            })
          );

          setStatus(
            suggestion
              ? "Press Tab to accept or Esc to dismiss"
              : "No suggestion available"
          );
        } catch (error) {
          if (
            currentId === requestId.current &&
            !(error instanceof Error && error.name === "AbortError")
          ) {
            setStatus("Backend unavailable");
          }
        }
      }, 400);
    };

    editor.on("update", update);
    editor.on("selectionUpdate", update);
    editor.on("focus", update);
    editor.on("blur", update);

    return () => {
      requestId.current++;
      clearTimeout(timer);
      controller?.abort();
      editor.off("update", update);
      editor.off("selectionUpdate", update);
      editor.off("focus", update);
      editor.off("blur", update);
    };
  }, [editor]);

  return (
    <div className="editor-container">
      <h2>Ghost Text AI Editor</h2>
      <p>Start typing your text below.</p>

      <EditorContent editor={editor} />

      <div className="editor-footer">
        <span role="status">{status}</span>
        <span>Tab: Accept | Esc: Dismiss</span>
      </div>
    </div>
  );
}
