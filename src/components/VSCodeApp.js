import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import fileSystemInstance from './fileSystemSingleton';
import { 
  FolderIcon, 
  ServerIcon,
  DocumentIcon, 
  ChevronRightIcon, 
  ChevronDownIcon,
  PlusIcon,
  FolderPlusIcon,
  ArrowPathIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  CogIcon,
  CloudArrowUpIcon,
  CloudIcon
} from '@heroicons/react/24/solid';
import MacOSDialog from './MacOSDialog';

// ConfirmDialog component
const ConfirmDialog = ({ message, onConfirm, onCancel, isOpen }) => (
  <MacOSDialog
    isOpen={isOpen}
    onClose={onCancel}
    title="Confirm Action"
    actions={[
      { label: "Cancel", onClick: onCancel },
      { label: "Confirm", onClick: onConfirm, primary: true }
    ]}
  >
    <p className="text-gray-700">{message}</p>
  </MacOSDialog>
);

// FileTreeItem component
const FileTreeItem = ({ item, depth, onSelect, selectedFile, fileSystem, updateFileTree, onDeleteConfirm, onRename }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleClick = () => {
    if (item.isDirectory) {
      toggleExpand();
    } else {
      onSelect(item);
    }
  };

  const getIcon = () => {
    if (item.isDirectory) {
      return isExpanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />;
    }
    return null;
  };

  const getFileIcon = () => {
    if (item.isDirectory) {
      return <FolderIcon className="w-4 h-4 text-yellow-500" />;
    }
    return <DocumentIcon className="w-4 h-4 text-blue-500" />;
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDeleteConfirm(item);
  };

  const handleRename = (e) => {
    e.stopPropagation();
    setIsRenaming(true);
  };

  const handleRenameConfirm = (e) => {
    e.stopPropagation();
    if (newName && newName !== item.name) {
      onRename(item, newName);
    }
    setIsRenaming(false);
  };

  return (
    <div>
      <div 
        className={`flex items-center py-0.5 px-2 cursor-pointer hover:bg-gray-700 ${selectedFile === item.name ? 'bg-blue-800' : ''}`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={handleClick}
      >
        {item.isDirectory && (
          <span onClick={toggleExpand} className="mr-1">
            {getIcon()}
          </span>
        )}
        {getFileIcon()}
        {isRenaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRenameConfirm}
            onKeyPress={(e) => e.key === 'Enter' && handleRenameConfirm(e)}
            className="ml-1 text-sm bg-transparent border-b border-white focus:outline-none"
            autoFocus
          />
        ) : (
          <span className="ml-1 text-sm">{item.name}</span>
        )}
        <div className="ml-auto flex space-x-2">
          <button onClick={handleRename} className="text-gray-400 hover:text-white">
            <PencilIcon className="h-4 w-4" />
          </button>
          <button onClick={handleDelete} className="text-gray-400 hover:text-white">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      {item.isDirectory && isExpanded && item.children && (
        <div>
          {item.children.map((child) => (
            <FileTreeItem 
              key={child.name} 
              item={child} 
              depth={depth + 1} 
              onSelect={onSelect}
              selectedFile={selectedFile}
              fileSystem={fileSystem}
              updateFileTree={updateFileTree}
              onDeleteConfirm={onDeleteConfirm}
              onRename={onRename}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// FileExplorer component
const FileExplorer = ({ fileSystem, onFileSelect, forceUpdate, onDeleteConfirm, currentPath, onRename }) => {
  const [fileTree, setFileTree] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const updateFileTree = useCallback(() => {
    const tree = fileSystem.ls(currentPath);
    setFileTree(tree);
  }, [fileSystem, currentPath]);

  useEffect(() => {
    updateFileTree();
  }, [updateFileTree, forceUpdate]);

  const handleSelect = (item) => {
    setSelectedFile(item.name);
    onFileSelect(item);
  };

  const handleNewFile = () => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      fileSystem.touch(`${currentPath}/${fileName}`);
      updateFileTree();
    }
  };

  const handleNewFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      fileSystem.mkdir(`${currentPath}/${folderName}`);
      updateFileTree();
    }
  };

  return (
    <div className="text-white bg-gray-800 h-full overflow-auto">
      <div className="font-bold text-sm py-2 px-4 uppercase flex items-center justify-between">
        Explorer
        <div className="flex space-x-2">
          <button onClick={handleNewFile} className="text-gray-400 hover:text-white">
            <PlusIcon className="h-4 w-4" />
          </button>
          <button onClick={handleNewFolder} className="text-gray-400 hover:text-white">
            <FolderPlusIcon className="h-4 w-4" />
          </button>
          <button onClick={updateFileTree} className="text-gray-400 hover:text-white">
            <ArrowPathIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div>
        {fileTree.map((item) => (
          <FileTreeItem 
            key={item.name} 
            item={item} 
            depth={0} 
            onSelect={handleSelect}
            selectedFile={selectedFile}
            fileSystem={fileSystem}
            updateFileTree={updateFileTree}
            onDeleteConfirm={onDeleteConfirm}
            onRename={onRename}
          />
        ))}
      </div>
    </div>
  );
};

// Updated VSCodeApp component
const VSCodeApp = ({ onClose }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [fileSystem] = useState(() => fileSystemInstance);
  const [currentFile, setCurrentFile] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [forceUpdate, setForceUpdate] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogProps, setConfirmDialogProps] = useState({ message: '', onConfirm: null });
  const [currentPath, setCurrentPath] = useState('/vscode');
  const [sidebarTab, setSidebarTab] = useState('explorer');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Initialize the vscode directory if it doesn't exist
    if (!fileSystem.ls('/').some(item => item.name === 'vscode')) {
      fileSystem.mkdir('/vscode');
    }
    setCurrentPath('/vscode');
  }, [fileSystem]);

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: '',
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: true },
        lineNumbers: 'on'
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, []);

  const handleFileSelect = useCallback((file) => {
    if (!file.isDirectory) {
      const content = fileSystem.cat(`${currentPath}/${file.name}`);
      setCurrentFile(file);

      if (editorRef.current) {
        let model = editorRef.current.getModel();

        if (!model) {
          model = monaco.editor.createModel(content || '', 'plaintext');
        } else {
          model.setValue(content || '');
        }

        if (model) {
          editorRef.current.setModel(model);

          const fileExtension = file.name.split('.').pop();
          const languageMap = {
            'js': 'javascript',
            'ts': 'typescript',
            'py': 'python',
            'html': 'html',
            'css': 'css'
          };
          const newLang = languageMap[fileExtension] || 'plaintext';
          monaco.editor.setModelLanguage(model, newLang);
          setLanguage(newLang);
        } else {
          console.error("Failed to create or set model.");
        }
      } else {
        console.error("Editor is not initialized.");
      }
    }
  }, [fileSystem, currentPath]);

  const handleSave = useCallback(() => {
    if (currentFile && editorRef.current) {
      const content = editorRef.current.getValue();
      fileSystem.updateFile(`${currentPath}/${currentFile.name}`, content);
      setForceUpdate(prev => prev + 1);
    }
  }, [currentFile, fileSystem, currentPath]);

  const handleDeleteConfirm = useCallback((item) => {
    setConfirmDialogProps({
      message: `Are you sure you want to delete ${item.name}?`,
      onConfirm: () => {
        fileSystem.rm(`${currentPath}/${item.name}`);
        if (currentFile && currentFile.name === item.name) {
          setCurrentFile(null);
          if (editorRef.current) {
            editorRef.current.setValue('');
          }
        }
        setForceUpdate(prev => prev + 1);
        setShowConfirmDialog(false);
      }
    });
    setShowConfirmDialog(true);
  }, [currentFile, fileSystem, currentPath]);

  const handleRename = useCallback((item, newName) => {
    fileSystem.mv(`${currentPath}/${item.name}`, `${currentPath}/${newName}`);
    if (currentFile && currentFile.name === item.name) {
      setCurrentFile({ ...currentFile, name: newName });
    }
    setForceUpdate(prev => prev + 1);
  }, [currentFile, fileSystem, currentPath]);

  const handleSearch = useCallback(() => {
    const results = fileSystem.search(currentPath, searchQuery);
    setSearchResults(results);
  }, [fileSystem, currentPath, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Menu bar */}
      <div className="flex items-center bg-gray-800 p-2 text-sm">
        <button className="px-2 hover:bg-gray-700">File</button>
        <button className="px-2 hover:bg-gray-700">Edit</button>
        <button className="px-2 hover:bg-gray-700">View</button>
        <button className="px-2 hover:bg-gray-700">Help</button>
        <button className="px-2 hover:bg-gray-700" onClick={handleSave}>Save</button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 overflow-y-auto">
          <div className="flex items-center justify-between p-2">
            <div className="font-bold text-sm">Sidebar</div>
            <div className="flex space-x-2">
              <button onClick={() => setSidebarTab('explorer')} className={`p-1 ${sidebarTab === 'explorer' ? 'bg-gray-700' : ''}`}>
                <FolderIcon className="h-4 w-4" />
              </button>
              <button onClick={() => setSidebarTab('search')} className={`p-1 ${sidebarTab === 'search' ? 'bg-gray-700' : ''}`}>
                <ServerIcon className="h-4 w-4" />
              </button>
              <button onClick={() => setSidebarTab('source-control')} className={`p-1 ${sidebarTab === 'source-control' ? 'bg-gray-700' : ''}`}>
                <CheckIcon className="h-4 w-4" />
              </button>
              <button onClick={() => setSidebarTab('settings')} className={`p-1 ${sidebarTab === 'settings' ? 'bg-gray-700' : ''}`}>
                <CogIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          {sidebarTab === 'explorer' && (
            <FileExplorer 
              fileSystem={fileSystem} 
              onFileSelect={handleFileSelect} 
              forceUpdate={forceUpdate}
              onDeleteConfirm={handleDeleteConfirm}
              currentPath={currentPath}
              onRename={handleRename}
            />
          )}
          {sidebarTab === 'search' && (
            <div className="p-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full p-1 bg-gray-700 text-white focus:outline-none"
              />
              <div className="mt-2">
                {searchResults.map((result, index) => (
                  <div key={index} className="text-sm p-1 hover:bg-gray-700">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}
          {sidebarTab === 'source-control' && (
            <div className="p-2">
              <button className="flex items-center space-x-2 p-1 hover:bg-gray-700">
                <CloudArrowUpIcon className="h-4 w-4" />
                <span>Push</span>
              </button>
              <button className="flex items-center space-x-2 p-1 hover:bg-gray-700">
                <CloudIcon className="h-4 w-4" />
                <span>Pull</span>
              </button>
            </div>
          )}
          {sidebarTab === 'settings' && (
            <div className="p-2">
              <div className="text-sm">Settings</div>
              <div className="mt-2">
                <label className="block text-sm">Theme</label>
                <select className="w-full p-1 bg-gray-700 text-white focus:outline-none">
                  <option value="vs-dark">Dark</option>
                  <option value="vs-light">Light</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Editor */}
        <div ref={containerRef} className="flex-grow" />
      </div>

      {/* Status bar */}
      <div className="flex justify-between items-center bg-blue-600 text-white text-xs p-1">
        <div>{currentFile ? `${currentPath}/${currentFile.name}` : 'No file open'}</div>
        <div>{language}</div>
        <div>Line: {editorRef.current?.getPosition()?.lineNumber}, Column: {editorRef.current?.getPosition()?.column}</div>
      </div>

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <ConfirmDialog
          message={confirmDialogProps.message}
          onConfirm={confirmDialogProps.onConfirm}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
};

export default VSCodeApp;