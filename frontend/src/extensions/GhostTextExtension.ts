
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

type GhostState = {
  suggestion: string;
  position: number;
  dismissed: boolean;
};

type GhostAction =
  | { type: "set"; suggestion: string; position: number }
  | { type: "clear" }
  | { type: "dismiss" };

export const ghostKey = new PluginKey<GhostState>("ghostText");

export const GhostTextExtension = Extension.create({
  name: "ghostText",

  addProseMirrorPlugins() {
    return [
      new Plugin<GhostState>({
        key: ghostKey,

        state: {
          init: () => ({
            suggestion: "",
            position: -1,
            dismissed: false,
          }),

          apply(tr, previous) {
            const action = tr.getMeta(ghostKey) as
              | GhostAction
              | undefined;

            if (action?.type === "dismiss") {
              return {
                suggestion: "",
                position: -1,
                dismissed: true,
              };
            }

            if (action?.type === "clear") {
              return {
                suggestion: "",
                position: -1,
                dismissed: false,
              };
            }

            if (tr.docChanged || tr.selectionSet) {
              return {
                suggestion: "",
                position: -1,
                dismissed: false,
              };
            }

            if (action?.type === "set" && !previous.dismissed) {
              return {
                suggestion: action.suggestion,
                position: action.position,
                dismissed: false,
              };
            }

            return previous;
          },
        },

        props: {
          decorations(state) {
            const ghost = ghostKey.getState(state);

            if (
              !ghost?.suggestion ||
              !state.selection.empty ||
              state.selection.from !== ghost.position
            ) {
              return DecorationSet.empty;
            }

            return DecorationSet.create(state.doc, [
              Decoration.widget(
                ghost.position,
                () => {
                  const span = document.createElement("span");
                  span.className = "ghost-suggestion";
                  span.textContent = ghost.suggestion;
                  span.contentEditable = "false";
                  span.setAttribute("aria-hidden", "true");
                  return span;
                },
                { side: 1 }
              ),
            ]);
          },

          handleKeyDown(view, event) {
            const ghost = ghostKey.getState(view.state);

            if (!ghost?.suggestion) return false;

            if (event.key === "Escape") {
              event.preventDefault();

              view.dispatch(
                view.state.tr.setMeta(ghostKey, {
                  type: "dismiss",
                })
              );

              return true;
            }

            if (event.key === "Tab" && !event.shiftKey) {
              if (
                !view.state.selection.empty ||
                view.state.selection.from !== ghost.position
              ) {
                return false;
              }

              event.preventDefault();

              view.dispatch(
                view.state.tr.insertText(ghost.suggestion)
              );

              return true;
            }

            return false;
          },
        },
      }),
    ];
  },
});
