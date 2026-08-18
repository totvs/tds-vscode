import * as vscode from "vscode";

let currentPanel: vscode.WebviewPanel | undefined = undefined;

/**
 * Abre uma webview com o grafo visual dos nós AST.
 */
export function showAstGraphView(ast: any, hasErrors: boolean, fileName: string) {
  const columnToShowIn = vscode.ViewColumn.Beside;

  if (currentPanel) {
    currentPanel.reveal(columnToShowIn);
  } else {
    currentPanel = vscode.window.createWebviewPanel(
      "totvs-developer-studio.ast.graphView",
      `AST: ${fileName}`,
      columnToShowIn,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    currentPanel.onDidDispose(() => {
      currentPanel = undefined;
    });
  }

  currentPanel.title = `AST: ${fileName}`;
  currentPanel.webview.html = getAstGraphHtml(ast, hasErrors);
}

function getAstGraphHtml(ast: any, hasErrors: boolean): string {
  const astJson = JSON.stringify(ast || {})
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>AST Graph</title>
  <style>
    :root {
      --bg-color: var(--vscode-editor-background, #1e1e1e);
      --fg-color: var(--vscode-editor-foreground, #d4d4d4);
      --node-bg: var(--vscode-editorWidget-background, #252526);
      --node-border: var(--vscode-editorWidget-border, #454545);
      --link-color: var(--vscode-textLink-foreground, #3794ff);
      --highlight-color: var(--vscode-editorWarning-foreground, #cca700);
      --error-color: var(--vscode-editorError-foreground, #f48771);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: var(--bg-color);
      color: var(--fg-color);
      font-family: var(--vscode-font-family, 'Segoe UI', sans-serif);
      font-size: 12px;
      overflow: hidden;
      width: 100vw;
      height: 100vh;
    }

    #toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      padding: 8px 12px;
      background: var(--node-bg);
      border-bottom: 1px solid var(--node-border);
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 100;
    }

    #toolbar button {
      background: var(--vscode-button-background, #0e639c);
      color: var(--vscode-button-foreground, #fff);
      border: none;
      padding: 4px 10px;
      cursor: pointer;
      border-radius: 2px;
      font-size: 12px;
    }

    #toolbar button:hover {
      background: var(--vscode-button-hoverBackground, #1177bb);
    }

    #toolbar .info {
      margin-left: auto;
      opacity: 0.7;
    }

    #toolbar .chk-label {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      opacity: 0.9;
    }

    #toolbar .chk-label input {
      cursor: pointer;
    }

    ${hasErrors ? `#toolbar .error-badge {
      background: var(--error-color);
      color: #fff;
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: bold;
    }` : ""}

    #canvas-container {
      width: 100%;
      height: 100%;
      padding-top: 42px;
      overflow: hidden;
    }

    svg {
      width: 100%;
      height: 100%;
    }

    .node-group {
      cursor: pointer;
    }

    .node-rect {
      fill: var(--node-bg);
      stroke: var(--node-border);
      stroke-width: 1.5px;
      rx: 4;
      ry: 4;
    }

    .node-rect:hover {
      stroke: var(--link-color);
      stroke-width: 2px;
    }

    .node-rect.collapsed {
      stroke: var(--highlight-color);
      stroke-dasharray: 4 2;
    }

    .node-type {
      fill: var(--link-color);
      font-weight: bold;
      font-size: 11px;
    }

    .node-value {
      fill: var(--fg-color);
      font-size: 10px;
      opacity: 0.85;
    }

    .node-children-count {
      fill: var(--highlight-color);
      font-size: 9px;
      opacity: 0.7;
    }

    .node-pos {
      fill: var(--fg-color);
      font-size: 9px;
      opacity: 0.5;
      font-style: italic;
    }

    .link {
      fill: none;
      stroke: var(--node-border);
      stroke-width: 1.2px;
    }
  </style>
</head>
<body>
  <div id="toolbar">
    <button id="btn-zoom-in" title="Zoom In">+</button>
    <button id="btn-zoom-out" title="Zoom Out">-</button>
    <button id="btn-fit" title="Fit to View">Fit</button>
    <button id="btn-expand-all" title="Expand All">Expand All</button>
    <button id="btn-collapse-all" title="Collapse All">Collapse All</button>
    <label class="chk-label"><input type="checkbox" id="chk-eol"/> eol</label>
    ${hasErrors ? '<span class="error-badge">AST has errors</span>' : ""}
    <span class="info" id="node-count"></span>
  </div>
  <div id="canvas-container">
    <svg id="svg-canvas"></svg>
  </div>

  <script>
    (function() {
      var astData = ${astJson};

      // ===== Normalizar AST para formato de arvore =====
      var IGNORED_TYPES = ['eol'];
      var POSITION_KEYS = ['startRow', 'startColumn', 'endRow', 'endColumn', 'isName'];

      function normalizeNode(node, key) {
        if (node === null || node === undefined) {
          return { type: key || 'null', value: String(node), children: [], pos: {} };
        }
        if (typeof node !== 'object') {
          return { type: key || typeof node, value: String(node), children: [], pos: {} };
        }
        if (Array.isArray(node)) {
          var items = [];
          for (var i = 0; i < node.length; i++) {
            var item = normalizeNode(node[i], String(i));
            if (item !== null && IGNORED_TYPES.indexOf(item.type.toLowerCase()) === -1) {
              items.push(item);
            }
          }
          return {
            type: key || 'Array',
            value: '[' + items.length + ']',
            children: items,
            pos: {}
          };
        }
        // Objeto
        var type = node.type || node.kind || node.name || key || 'Object';
        if (IGNORED_TYPES.indexOf(String(type).toLowerCase()) !== -1) {
          return null;
        }
        var value = node.value || node.text || node.id || '';
        var pos = {};
        for (var pi = 0; pi < POSITION_KEYS.length; pi++) {
          var pk = POSITION_KEYS[pi];
          if (node[pk] !== undefined && node[pk] !== null) {
            pos[pk] = node[pk];
          }
        }
        var children = [];
        var keys = Object.keys(node);
        for (var ki = 0; ki < keys.length; ki++) {
          var k = keys[ki];
          var v = node[k];
          if (k === 'type' || k === 'kind' || k === 'name' || k === 'value' || k === 'text' || k === 'id') continue;
          if (POSITION_KEYS.indexOf(k) !== -1) continue;
          if (v === null || v === undefined) continue;
          if (typeof v === 'object') {
            var child = normalizeNode(v, k);
            if (child !== null) {
              children.push(child);
            }
          } else {
            children.push({ type: k, value: String(v), children: [], pos: {} });
          }
        }
        return { type: String(type), value: String(value || ''), children: children, pos: pos };
      }

      // ===== Estado =====
      var collapsed = {};
      var nodeIdCounter = 0;
      var root = null;

      function assignIds(node) {
        node._id = nodeIdCounter++;
        for (var i = 0; i < node.children.length; i++) {
          assignIds(node.children[i]);
        }
      }

      function buildTree() {
        var tree = normalizeNode(astData, 'root');
        if (tree === null) {
          tree = { type: 'root', value: '', children: [], pos: {} };
        }
        nodeIdCounter = 0;
        assignIds(tree);
        document.getElementById('node-count').textContent = nodeIdCounter + ' nodes';
        return tree;
      }

      root = buildTree();

      // ===== Layout de arvore =====
      var NODE_W = 160;
      var NODE_H = 56;
      var H_GAP = 24;
      var V_GAP = 16;

      function layoutTree(node, depth) {
        if (collapsed[node._id] || node.children.length === 0) {
          return { node: node, x: 0, y: depth * (NODE_H + V_GAP), w: NODE_W, children: [] };
        }
        var childLayouts = [];
        for (var i = 0; i < node.children.length; i++) {
          childLayouts.push(layoutTree(node.children[i], depth + 1));
        }
        var totalW = 0;
        for (var i = 0; i < childLayouts.length; i++) {
          totalW += childLayouts[i].w;
        }
        totalW += (childLayouts.length - 1) * H_GAP;
        var offsetX = -totalW / 2;
        for (var i = 0; i < childLayouts.length; i++) {
          childLayouts[i].x = offsetX + childLayouts[i].w / 2;
          offsetX += childLayouts[i].w + H_GAP;
        }
        return {
          node: node,
          x: 0,
          y: depth * (NODE_H + V_GAP),
          w: Math.max(NODE_W, totalW),
          children: childLayouts
        };
      }

      // ===== Renderizar SVG =====
      var svg = document.getElementById('svg-canvas');
      var transform = { x: 0, y: 0, scale: 1 };

      function render() {
        var layout = layoutTree(root, 0);
        var elements = [];
        var links = [];

        function traverse(l, px, parentX, parentY) {
          var absX = px + l.x;
          var absY = l.y;
          if (parentX !== null) {
            links.push({ x1: parentX, y1: parentY + NODE_H, x2: absX, y2: absY });
          }
          elements.push({ node: l.node, x: absX, y: absY, hasChildren: l.node.children.length > 0 });
          for (var i = 0; i < l.children.length; i++) {
            traverse(l.children[i], absX, absX, absY);
          }
        }
        traverse(layout, 0, null, null);

        var svgContent = '<g id="main-group" transform="translate(' + transform.x + ',' + transform.y + ') scale(' + transform.scale + ')">';

        // Links
        for (var li = 0; li < links.length; li++) {
          var lk = links[li];
          var midY = (lk.y1 + lk.y2) / 2;
          svgContent += '<path class="link" d="M' + lk.x1 + ',' + lk.y1 +
            ' C' + lk.x1 + ',' + midY + ' ' + lk.x2 + ',' + midY + ' ' + lk.x2 + ',' + lk.y2 + '"/>';
        }

        // Nodes
        for (var ei = 0; ei < elements.length; ei++) {
          var el = elements[ei];
          var nx = el.x - NODE_W / 2;
          var ny = el.y;
          var isCollapsed = !!collapsed[el.node._id];
          var typeText = el.node.type.length > 20 ? el.node.type.substring(0, 18) + '..' : el.node.type;
          var valueText = el.node.value.length > 22 ? el.node.value.substring(0, 20) + '..' : el.node.value;

          var pos = el.node.pos || {};
          var posText = '';
          if (pos.startRow !== undefined) {
            posText = pos.startRow + ':' + (pos.startColumn || 0);
            if (pos.endRow !== undefined) {
              posText += ' > ' + pos.endRow + ':' + (pos.endColumn || 0);
            }
            if (pos.isName) {
              posText += ' [name]';
            }
          }

          svgContent += '<g class="node-group" data-id="' + el.node._id + '">';
          svgContent += '<rect class="node-rect' + (isCollapsed ? ' collapsed' : '') + '" x="' + nx + '" y="' + ny + '" width="' + NODE_W + '" height="' + NODE_H + '"/>';
          svgContent += '<text class="node-type" x="' + (nx + 6) + '" y="' + (ny + 15) + '">' + escapeHtml(typeText) + '</text>';
          if (valueText) {
            svgContent += '<text class="node-value" x="' + (nx + 6) + '" y="' + (ny + 28) + '">' + escapeHtml(valueText) + '</text>';
          }
          if (posText) {
            svgContent += '<text class="node-pos" x="' + (nx + 6) + '" y="' + (ny + 40) + '">' + escapeHtml(posText) + '</text>';
          }
          if (el.hasChildren) {
            var countText = isCollapsed ? '(+' + el.node.children.length + ')' : '(' + el.node.children.length + ')';
            svgContent += '<text class="node-children-count" x="' + (nx + NODE_W - 6) + '" y="' + (ny + 15) + '" text-anchor="end">' + countText + '</text>';
          }
          svgContent += '</g>';
        }

        svgContent += '</g>';
        svg.innerHTML = svgContent;

        // Eventos de click nos nos
        var groups = svg.querySelectorAll('.node-group');
        for (var gi = 0; gi < groups.length; gi++) {
          (function(g) {
            g.addEventListener('click', function() {
              var id = parseInt(g.getAttribute('data-id'));
              if (collapsed[id]) {
                delete collapsed[id];
              } else {
                collapsed[id] = true;
              }
              render();
            });
          })(groups[gi]);
        }
      }

      function escapeHtml(s) {
        return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      }

      // ===== Pan & Zoom =====
      var isDragging = false;
      var dragStart = { x: 0, y: 0 };

      var container = document.getElementById('canvas-container');

      container.addEventListener('mousedown', function(e) {
        isDragging = true;
        dragStart = { x: e.clientX - transform.x, y: e.clientY - transform.y };
      });

      container.addEventListener('mousemove', function(e) {
        if (isDragging) {
          transform.x = e.clientX - dragStart.x;
          transform.y = e.clientY - dragStart.y;
          var g = document.getElementById('main-group');
          if (g) g.setAttribute('transform', 'translate(' + transform.x + ',' + transform.y + ') scale(' + transform.scale + ')');
        }
      });

      container.addEventListener('mouseup', function() { isDragging = false; });
      container.addEventListener('mouseleave', function() { isDragging = false; });

      container.addEventListener('wheel', function(e) {
        e.preventDefault();
        var delta = e.deltaY > 0 ? 0.9 : 1.1;
        transform.scale *= delta;
        transform.scale = Math.max(0.1, Math.min(5, transform.scale));
        var g = document.getElementById('main-group');
        if (g) g.setAttribute('transform', 'translate(' + transform.x + ',' + transform.y + ') scale(' + transform.scale + ')');
      });

      // ===== Toolbar =====
      document.getElementById('btn-zoom-in').addEventListener('click', function() {
        transform.scale = Math.min(5, transform.scale * 1.2);
        render();
      });
      document.getElementById('btn-zoom-out').addEventListener('click', function() {
        transform.scale = Math.max(0.1, transform.scale / 1.2);
        render();
      });
      document.getElementById('btn-fit').addEventListener('click', function() {
        transform = { x: svg.clientWidth / 2, y: 60, scale: 0.8 };
        render();
      });
      document.getElementById('btn-expand-all').addEventListener('click', function() {
        collapsed = {};
        render();
      });
      document.getElementById('btn-collapse-all').addEventListener('click', function() {
        function collapseAll(node) {
          if (node.children.length > 0) {
            collapsed[node._id] = true;
            for (var i = 0; i < node.children.length; i++) {
              collapseAll(node.children[i]);
            }
          }
        }
        collapseAll(root);
        delete collapsed[root._id];
        render();
      });

      // Checkbox eol - mostrar/ocultar nos eol
      document.getElementById('chk-eol').addEventListener('change', function(e) {
        if (e.target.checked) {
          var idx = IGNORED_TYPES.indexOf('eol');
          if (idx !== -1) { IGNORED_TYPES.splice(idx, 1); }
        } else {
          if (IGNORED_TYPES.indexOf('eol') === -1) {
            IGNORED_TYPES.push('eol');
          }
        }
        collapsed = {};
        root = buildTree();
        render();
      });

      // ===== Init =====
      transform = { x: svg.clientWidth / 2 || 400, y: 60, scale: 0.8 };
      render();
    })();
  </script>
</body>
</html>`;
}
