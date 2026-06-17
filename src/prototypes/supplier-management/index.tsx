/**
 * @name 供应商管理
 */
import React, { useState, useMemo } from 'react';
import './style.css';
import supplierData from '../../resources/供应商表.json';

interface Supplier {
  id: number;
  供应商全称: string;
  供应商编码: string;
  供应商简称: string;
  法人代表: string;
  经营范围: string;
  供应商标识: string | null;
  分级: string | null;
  地区: string;
  供应商成立时间: string;
  单位地址: string;
  注册资本金: number;
  "开户银行(1)": string;
  "银行账号(1)": string;
  审核状态: string;
  供应商状态: string;
  联系方式: string | null;
  "年度生产能力(吨)": number;
}

export default function SupplierManagement() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const suppliers: Supplier[] = (supplierData as any).records || [];

  // 提取唯一的分级和状态列表
  const grades = useMemo(() => {
    const uniqueGrades = Array.from(new Set(suppliers.map(s => s.分级).filter(Boolean))).sort();
    return uniqueGrades;
  }, []);

  const statuses = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(suppliers.map(s => s.审核状态))).sort();
    return uniqueStatuses;
  }, []);

  // 筛选逻辑
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      // 关键词搜索
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const matchName = supplier.供应商全称.toLowerCase().includes(keyword);
        const matchShortName = supplier.供应商简称?.toLowerCase().includes(keyword);
        const matchCode = supplier.供应商编码?.toLowerCase().includes(keyword);
        if (!matchName && !matchShortName && !matchCode) return false;
      }

      // 分级筛选
      if (selectedGrade && supplier.分级 !== selectedGrade) {
        return false;
      }

      // 状态筛选
      if (selectedStatus && supplier.审核状态 !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [suppliers, searchKeyword, selectedGrade, selectedStatus]);

  return (
    <div className="supplier-management">
      {/* Header */}
      <div className="toolbar">
        <div className="toolbar-content">
          <div className="toolbar-left">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索供应商名称、编码..."
              className="search-input"
            />

            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="filter-select"
            >
              <option value="">全部分级</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">全部状态</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Cards Grid */}
        <div className="cards-panel">
          <div className="cards-grid">
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                onClick={() => setSelectedSupplier(supplier)}
                className={`supplier-card ${selectedSupplier?.id === supplier.id ? 'selected' : ''}`}
              >
                <div className="card-title">{supplier.供应商简称}</div>
                <div className="card-code">{supplier.供应商编码}</div>

                <div className="card-badges">
                  {supplier.分级 && (
                    <span className={`badge ${
                      supplier.分级 === 'AA级' ? 'badge-aa' :
                      supplier.分级 === 'A级' ? 'badge-a' :
                      supplier.分级 === 'B级' ? 'badge-b' : 'badge-gray'
                    }`}>
                      {supplier.分级}
                    </span>
                  )}
                  {supplier.供应商标识 && (
                    <span className={`badge ${
                      supplier.供应商标识 === '重点' ? 'badge-blue' :
                      supplier.供应商标识 === '上市' ? 'badge-purple' :
                      supplier.供应商标识 === '高新' ? 'badge-cyan' : 'badge-pink'
                    }`}>
                      {supplier.供应商标识}
                    </span>
                  )}
                </div>

                <div className="card-footer">
                  {supplier.审核状态 && (
                    <div className="status-dot">
                      <div className={`dot ${
                        supplier.审核状态 === '已审批' ? 'dot-green' : 'dot-orange'
                      }`}></div>
                      <span>{supplier.审核状态}</span>
                    </div>
                  )}
                  <span>{supplier.地区}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredSuppliers.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">未找到匹配的供应商</div>
              <div className="empty-text">试试调整筛选条件或搜索关键词</div>
              <button
                onClick={() => {
                  setSearchKeyword('');
                  setSelectedGrade('');
                  setSelectedStatus('');
                }}
                className="btn-primary"
              >
                清除筛选
              </button>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedSupplier && (
          <div className="detail-panel">
            <div className="detail-card">
              <h2 className="detail-title">供应商详情</h2>

              <div className="detail-section">
                <div className="section-content">
                  <div className="detail-field">
                    <div className="field-label">供应商全称</div>
                    <div className="field-value">{selectedSupplier.供应商全称}</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">供应商编码</div>
                    <div className="field-value mono">{selectedSupplier.供应商编码}</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">供应商简称</div>
                    <div className="field-value">{selectedSupplier.供应商简称}</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">法人代表</div>
                    <div className="field-value">{selectedSupplier.法人代表}</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">成立时间</div>
                    <div className="field-value">{selectedSupplier.供应商成立时间}</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">单位地址</div>
                    <div className="field-value">{selectedSupplier.单位地址}</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">联系方式</div>
                    <div className="field-value">{selectedSupplier.联系方式 || '-'}</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">经营范围</div>
                    <div className="field-value">{selectedSupplier.经营范围}</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">注册资本金</div>
                    <div className="field-value">{selectedSupplier.注册资本金}万元</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">年度生产能力</div>
                    <div className="field-value">{selectedSupplier["年度生产能力(吨)"]}吨</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">开户银行</div>
                    <div className="field-value">{selectedSupplier["开户银行(1)"]}</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">银行账号</div>
                    <div className="field-value mono">{selectedSupplier["银行账号(1)"]}</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">审核状态</div>
                    <div className="field-value">{selectedSupplier.审核状态}</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">供应商状态</div>
                    <div className="field-value">{selectedSupplier.供应商状态}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
