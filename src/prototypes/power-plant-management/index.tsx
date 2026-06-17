/**
 * @name 电厂基本信息管理
 */
import React, { useState, useMemo } from 'react';
import './style.css';
import powerPlantData from '../../resources/电厂表.json';

interface PowerPlant {
  id: string;
  单位名称: string;
  简称: string;
  所属分公司: string;
  装机容量: number;
  详细装机情况: string | number;
  省份: string;
  城市: string;
  经度: number;
  纬度: number;
}

export default function PowerPlantManagement() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [capacityMin, setCapacityMin] = useState('');
  const [capacityMax, setCapacityMax] = useState('');
  const [selectedPlant, setSelectedPlant] = useState<PowerPlant | null>(null);

  const plants: PowerPlant[] = powerPlantData.records;

  // 提取唯一的省份和分公司列表
  const provinces = useMemo(() => {
    const uniqueProvinces = Array.from(new Set(plants.map(p => p.省份))).sort();
    return uniqueProvinces;
  }, []);

  const companies = useMemo(() => {
    const uniqueCompanies = Array.from(new Set(plants.map(p => p.所属分公司))).sort();
    return uniqueCompanies;
  }, []);

  // 筛选逻辑
  const filteredPlants = useMemo(() => {
    return plants.filter(plant => {
      // 关键词搜索
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const matchName = plant.单位名称.toLowerCase().includes(keyword);
        const matchShortName = plant.简称.toLowerCase().includes(keyword);
        if (!matchName && !matchShortName) return false;
      }

      // 省份筛选
      if (selectedProvince && plant.省份 !== selectedProvince) return false;

      // 分公司筛选
      if (selectedCompany && plant.所属分公司 !== selectedCompany) return false;

      // 装机容量筛选
      if (capacityMin && plant.装机容量 < Number(capacityMin)) return false;
      if (capacityMax && plant.装机容量 > Number(capacityMax)) return false;

      return true;
    });
  }, [plants, searchKeyword, selectedProvince, selectedCompany, capacityMin, capacityMax]);

  const resetFilters = () => {
    setSearchKeyword('');
    setSelectedProvince('');
    setSelectedCompany('');
    setCapacityMin('');
    setCapacityMax('');
  };

  return (
    <div className="power-plant-management">
      {/* Header */}
      <header className="page-header">
        <h1>电厂基本信息管理</h1>
        <p className="subtitle">共 {plants.length} 家电厂，当前显示 {filteredPlants.length} 条</p>
      </header>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-row">
          <div className="filter-group">
            <label>关键词搜索</label>
            <input
              type="text"
              placeholder="搜索单位名称或简称"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>省份</label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="filter-select"
            >
              <option value="">全部省份</option>
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>所属分公司</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="filter-select"
            >
              <option value="">全部分公司</option>
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group capacity-range">
            <label>装机容量范围 (MW)</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="最小值"
                value={capacityMin}
                onChange={(e) => setCapacityMin(e.target.value)}
                className="filter-input filter-input-small"
              />
              <span className="range-separator">-</span>
              <input
                type="number"
                placeholder="最大值"
                value={capacityMax}
                onChange={(e) => setCapacityMax(e.target.value)}
                className="filter-input filter-input-small"
              />
            </div>
          </div>

          <button onClick={resetFilters} className="reset-button">
            重置筛选
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="content-area">
        {/* Table */}
        <div className="table-container">
          <table className="plants-table">
            <thead>
              <tr>
                <th>单位名称</th>
                <th>简称</th>
                <th>所属分公司</th>
                <th>装机容量 (MW)</th>
                <th>省份</th>
                <th>城市</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    暂无符合条件的电厂数据
                  </td>
                </tr>
              ) : (
                filteredPlants.map(plant => (
                  <tr key={plant.id} onClick={() => setSelectedPlant(plant)} className="table-row">
                    <td className="plant-name">{plant.单位名称}</td>
                    <td>{plant.简称}</td>
                    <td className="company-name">{plant.所属分公司}</td>
                    <td className="capacity">{plant.装机容量}</td>
                    <td>{plant.省份}</td>
                    <td>{plant.城市}</td>
                    <td>
                      <button
                        className="view-detail-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlant(plant);
                        }}
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {selectedPlant && (
          <div className="detail-panel">
            <div className="detail-header">
              <h2>电厂详情</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedPlant(null)}
              >
                ✕
              </button>
            </div>
            <div className="detail-content">
              <div className="detail-row">
                <label>单位名称</label>
                <span>{selectedPlant.单位名称}</span>
              </div>
              <div className="detail-row">
                <label>简称</label>
                <span>{selectedPlant.简称}</span>
              </div>
              <div className="detail-row">
                <label>所属分公司</label>
                <span>{selectedPlant.所属分公司}</span>
              </div>
              <div className="detail-row">
                <label>装机容量</label>
                <span>{selectedPlant.装机容量} MW</span>
              </div>
              <div className="detail-row">
                <label>详细装机情况</label>
                <span>{selectedPlant.详细装机情况 || '暂无数据'}</span>
              </div>
              <div className="detail-row">
                <label>省份</label>
                <span>{selectedPlant.省份}</span>
              </div>
              <div className="detail-row">
                <label>城市</label>
                <span>{selectedPlant.城市}</span>
              </div>
              <div className="detail-row">
                <label>经度</label>
                <span>{selectedPlant.经度}</span>
              </div>
              <div className="detail-row">
                <label>纬度</label>
                <span>{selectedPlant.纬度}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
