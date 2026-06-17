/**
 * @name 用户管理
 * @mode axure
 *
 * 参考资料：
 * - /rules/axure-export-workflow.md
 * - /rules/prototype-development-guide.md
 */
import React, { useState, useMemo } from 'react';
import {
  AnnotationViewer,
  type AnnotationSourceDocument,
  type AnnotationViewerOptions,
  useProtoDevState,
  setProtoDevState,
} from '@axhub/annotation';
import annotationSourceDocument from './annotation-source.json';
import './style.css';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'member' | 'guest';
  status: 'active' | 'inactive';
  joinedAt: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'Alice Wu', email: 'alice@company.com', avatar: 'A', role: 'admin', status: 'active', joinedAt: '3天前' },
  { id: '2', name: 'Bob Lee', email: 'bob@company.com', avatar: 'B', role: 'member', status: 'active', joinedAt: '1周前' },
  { id: '3', name: 'Carol Yu', email: 'carol@company.com', avatar: 'C', role: 'member', status: 'inactive', joinedAt: '2月前' },
  { id: '4', name: 'David Chen', email: 'david@company.com', avatar: 'D', role: 'guest', status: 'active', joinedAt: '5天前' },
  { id: '5', name: 'Emma Zhang', email: 'emma@company.com', avatar: 'E', role: 'member', status: 'active', joinedAt: '1月前' },
  { id: '6', name: 'Frank Liu', email: 'frank@company.com', avatar: 'F', role: 'member', status: 'active', joinedAt: '2周前' },
  { id: '7', name: 'Grace Wang', email: 'grace@company.com', avatar: 'G', role: 'guest', status: 'active', joinedAt: '10天前' },
  { id: '8', name: 'Henry Zhao', email: 'henry@company.com', avatar: 'H', role: 'member', status: 'inactive', joinedAt: '3月前' },
];

const roleLabels = {
  admin: '管理员',
  member: '成员',
  guest: '访客',
};

const statusLabels = {
  active: '活跃',
  inactive: '停用',
};

const Component = function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  // 使用标注状态控制
  const protoDevState = useProtoDevState<{ list_state?: 'empty' | 'filled' }>();
  const listState = protoDevState.list_state || 'filled';

  // 根据状态决定显示的用户列表
  const displayUsers = listState === 'empty' ? [] : users;

  const filteredUsers = displayUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 标注 viewer 配置
  const annotationOptions = useMemo<AnnotationViewerOptions>(() => ({
    showToolbar: true,
    showThemeToggle: true,
    showColorFilter: true,
    emptyWhenNoData: false,
    toolbarEdge: 'right',
    currentPageId: 'main',
  }), []);

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user });
    setIsAddingUser(false);
  };

  const handleAddUser = () => {
    setEditingUser({
      id: Date.now().toString(),
      name: '',
      email: '',
      avatar: '?',
      role: 'member',
      status: 'active',
      joinedAt: '刚刚',
    });
    setIsAddingUser(true);
  };

  const handleSaveUser = () => {
    if (!editingUser) return;

    if (isAddingUser) {
      setUsers([...users, editingUser]);
    } else {
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    }

    setEditingUser(null);
    setIsAddingUser(false);
  };

  const handleCloseDrawer = () => {
    setEditingUser(null);
    setIsAddingUser(false);
  };

  const handleDeleteUser = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('确定要删除这个用户吗？')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleEditClick = (user: User, event: React.MouseEvent) => {
    event.stopPropagation();
    handleEditUser(user);
  };

  return (
    <div className="user-management">
      {/* Top Bar */}
      <header className="top-bar" data-annotation-id="page-header">
        <div className="top-bar-left">
          <button className="menu-button">☰</button>
          <h1 className="page-title">用户管理</h1>
        </div>
        <div className="top-bar-right">
          <div className="user-avatar">U</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Header Section */}
        <div className="content-header">
          <div className="header-text">
            <h2 className="header-title">用户管理</h2>
            <p className="header-subtitle">管理团队成员、角色和权限</p>
          </div>
          <div className="header-actions">
            <div className="search-box" data-annotation-id="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="搜索用户..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button 
              className="btn-primary" 
              onClick={handleAddUser}
              data-annotation-id="add-user-button"
            >
              + 添加用户
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="table-container" data-annotation-id="user-table">
          {filteredUsers.length === 0 ? (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: '#999',
              fontSize: '16px'
            }}>
              {listState === 'empty' 
                ? '暂无用户数据，点击"添加用户"开始创建' 
                : '未找到匹配的用户'}
            </div>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>用户</th>
                  <th>邮箱</th>
                  <th>角色</th>
                  <th>状态</th>
                  <th>加入时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="table-row-clickable">
                    <td>
                      <div className="user-cell">
                        <div className="avatar">{user.avatar}</div>
                        <span className="user-name">{user.name}</span>
                      </div>
                    </td>
                    <td className="text-muted">{user.email}</td>
                    <td>{roleLabels[user.role]}</td>
                    <td>
                      <div className="status-cell">
                        <span className={`status-dot ${user.status}`}></span>
                        <span className={user.status === 'active' ? '' : 'text-subtle'}>{statusLabels[user.status]}</span>
                      </div>
                    </td>
                    <td className="text-subtle">{user.joinedAt}</td>
                    <td data-annotation-id="table-actions">
                      <div className="action-buttons">
                        <button
                          className="btn-action"
                          onClick={(e) => handleEditClick(user, e)}
                          title="编辑"
                        >
                          编辑
                        </button>
                        <button
                          className="btn-action btn-action-danger"
                          onClick={(e) => handleDeleteUser(user.id, e)}
                          title="删除"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Edit Drawer */}
      {editingUser && (
        <>
          <div className="drawer-overlay" onClick={handleCloseDrawer}></div>
          <div className="drawer" data-annotation-id="edit-drawer">
            <div className="drawer-header">
              <h3 className="drawer-title">{isAddingUser ? '添加用户' : '编辑用户'}</h3>
              <button className="drawer-close" onClick={handleCloseDrawer}>✕</button>
            </div>

            <div className="drawer-content">
              <div className="form-group">
                <label className="form-label">姓名</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  placeholder="输入姓名"
                />
              </div>

              <div className="form-group">
                <label className="form-label">邮箱</label>
                <input
                  type="email"
                  className="form-input"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  placeholder="输入邮箱地址"
                />
              </div>

              <div className="form-group" data-annotation-id="role-field">
                <label className="form-label">角色</label>
                <select
                  className="form-select"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as User['role'] })}
                >
                  <option value="admin">管理员</option>
                  <option value="member">成员</option>
                  <option value="guest">访客</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">状态</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="status"
                      checked={editingUser.status === 'active'}
                      onChange={() => setEditingUser({ ...editingUser, status: 'active' })}
                    />
                    <span className="radio-text">活跃</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="status"
                      checked={editingUser.status === 'inactive'}
                      onChange={() => setEditingUser({ ...editingUser, status: 'inactive' })}
                    />
                    <span className="radio-text">停用</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="drawer-footer">
              <button className="btn-secondary" onClick={handleCloseDrawer}>取消</button>
              <button className="btn-primary" onClick={handleSaveUser}>保存</button>
            </div>
          </div>
        </>
      )}

      {/* Annotation Viewer */}
      <AnnotationViewer
        source={annotationSourceDocument as unknown as AnnotationSourceDocument}
        options={annotationOptions}
      />
    </div>
  );
};

export default Component;
