'use client';

import React, { useState, useMemo } from 'react';
import StatusBadge from './statusbadge';
import ResendButton from './resendbutton';
import { WalletInvitesTableProps } from './types';
import AddInviteModal from './AddInviteModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


type SortDirection = 'asc' | 'desc';
type SortableColumn = keyof WalletInvitesTableProps['data'][0];
type GroupByOption = 'trial' | 'country' | 'language' | null;

const WalletInvitesTable: React.FC<WalletInvitesTableProps> = ({ data = [], onResend }) => {
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [groupBy, setGroupBy] = useState<GroupByOption>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    // Try native Date parsing first (handles ISO strings like 2025-09-01T12:00:00Z)
    const iso = new Date(dateStr);
    if (!isNaN(iso.getTime())) return iso;

    // Fallback: parse dd/MM/yyyy
    const parts = dateStr.split('/').map(Number);
    if (parts.length === 3) {
      const [day, month, year] = parts;
      if (day && month && year) {
        const d = new Date(year, month - 1, day);
        if (!isNaN(d.getTime())) return d;
      }
    }
    return null;
  };

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setGroupBy(null);
    setSearch('');
    setStartDate(null);
    setEndDate(null);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const filteredData = useMemo(() => {
    return data
      .filter((row) => {
        const searchLower = search.toLowerCase();
        const matchesSearch =
  row.trial.toLowerCase().includes(searchLower) ||
  row.language.toLowerCase().includes(searchLower) ||
  row.mobile.includes(searchLower) ||
  row.country.toLowerCase().includes(searchLower) ||
  row.cardId.toLowerCase().includes(searchLower) ||
  row.requestId.toLowerCase().includes(searchLower) ||
  row.status.toLowerCase().includes(searchLower);


        const matchesFilters = Object.entries(filters).every(([key, val]) => {
          if (!val) return true;
          return (row as any)[key]?.toString().toLowerCase() === val.toLowerCase();
        });

        let matchesDate = true;
        if (startDate || endDate) {
          const rowDate = parseDate(row.sentDate);
          if (rowDate) {
            if (startDate && rowDate < startDate) matchesDate = false;
            if (endDate && rowDate > endDate) matchesDate = false;
          } else {
            matchesDate = false;
          }
        }

        return matchesSearch && matchesFilters && matchesDate;
      })
      .sort((a, b) => {
        if (!sortColumn) return 0;

        const valA = a[sortColumn];
        const valB = b[sortColumn];

        if (valA == null) return 1;
        if (valB == null) return -1;

        if (sortColumn === 'sentDate') {
          const dateA = parseDate(valA as string)?.getTime() ?? 0;
          const dateB = parseDate(valB as string)?.getTime() ?? 0;
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [data, search, filters, sortColumn, sortDirection, startDate, endDate]);

  const groupedData = useMemo(() => {
    if (!groupBy) return null;
    return filteredData.reduce((groups: { [key: string]: typeof filteredData }, row) => {
      const key = (row as any)[groupBy] || 'Other';
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
      return groups;
    }, {});
  }, [filteredData, groupBy]);

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const renderSortIcon = (column: SortableColumn) => {
    if (sortColumn !== column) return '⬍';
    return sortDirection === 'asc' ? '▲' : '▼';
  };

  const renderColGroup = () => (
    <colgroup>
      <col style={{ width: '14%' }} />
      <col style={{ width: '12%' }} />
      <col style={{ width: '12%' }} />
      <col style={{ width: '12%' }} />
      <col style={{ width: '10%' }} />
      <col style={{ width: '10%' }} />
      <col style={{ width: '12%' }} />
      <col style={{ width: '8%' }} />
      <col style={{ width: '10%' }} />
    </colgroup>
  );

 const renderTableHeader = () => (
  <thead className="bg-gray-50 border-b border-gray-300 sticky top-0 z-10">
    {/* Controls Row */}
   <tr>
  <th colSpan={9} className="px-6 py-4 border-b border-gray-200 bg-gray-100">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">

      {/* Title - Always Left */}
     <div className="text-left w-full sm:w-auto">
        <h2 className="text-xl font-semibold text-gray-800">Wallet Invites</h2>
      </div>

      {/* Controls - Right on Desktop, Stacked on Mobile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4  ">
        <div className="relative w-[250px] sm:w-64">

          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 font-normal text-sm border rounded-full"
          />
          <span className="absolute right-3 top-2 text-sm">🔍</span>
        </div>

        <button
          className="bg-[#007fb2] text-white px-4 py-2 h-9 rounded-full text-sm flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <span className="text-lg">＋</span>
          <span>Add</span>
        </button>
      </div>

    </div>
  </th>
</tr>


    {/* Filters Row */}
    <tr>
      <th colSpan={9} className="px-6 py-3 border-b border-gray-300">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-4 text-xs">
          {/* GROUP Section */}
          <div className="flex items-center gap-2">
            <span className="font-semibold">GROUP</span>
            <select
              value={groupBy || ''}
              onChange={(e) => setGroupBy(e.target.value as GroupByOption)}
              className="px-2 py-1 w-28 h-9 bg-gray-100 font-normal rounded-md border"
            >
              <option value="">Select</option>
              <option value="trial">Trial</option>
              <option value="country">Country</option>
              <option value="language">Language</option>
            </select>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300" />

          {/* FILTER Section */}
           <div className="flex flex-col sm:flex-row gap-2"></div>
          <div className="flex flex-wrap items-center gap-2 font-normal">
            <span className="font-semibold">FILTER</span>
            {['trial', 'country', 'language', 'status'].map((key) => (
              <select
                key={key}
                value={filters[key] || ''}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="px-2 py-1 w-30 h-9 bg-gray-100 rounded-md border"
              >
                <option value="">
                  {key === 'trial'
                    ? 'Clinical Trial'
                    : key === 'country'
                    ? 'Country/Region'
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
                {[...new Set(data.map((row) => (row as any)[key]).filter(Boolean))].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            ))}
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300" />

          {/* DATE Section */}
          <div className="flex items-center gap-2">
            <span className="font-bold">DATE</span>
            <div className="flex items-center bg-white h-9 w-24 border rounded-md px-2">
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                placeholderText="Start"
                className="w-full font-normal text-xs bg-transparent outline-none"
                dateFormat="dd/MM/yyyy"
                wrapperClassName="date-picker-high-z-index"
              />
            </div>

            <div className="flex items-center bg-white h-9 w-24 border rounded-md px-2">
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                placeholderText="End"
                className="w-full font-normal text-xs bg-transparent outline-none"
                dateFormat="dd/MM/yyyy"
                wrapperClassName="date-picker-high-z-index"
              />
            </div>
          </div>

          {(Object.keys(filters).length > 0 || groupBy || search || startDate || endDate) && (
            <button onClick={clearFilters} className="ml-2 px-3 py-1 rounded-full border text-xs">
              ✕
            </button>
          )}
        </div>
      </th>
    </tr>

    {/* Column Headers Row */}
    <tr>
     {[
  { label: 'Clinical trial', key: 'trial' },
  { label: 'Language', key: 'language' },
  { label: 'Mobile', key: 'mobile' },
  { label: 'Country/Region', key: 'country' },
  { label: 'Card ID', key: 'cardId' },
  { label: 'Request ID', key: 'requestId' },
  { label: 'Sent date', key: 'sentDate' },
  { label: 'Status', key: 'status' },
].map(({ label, key }) => {
  const reducedPaddingKeys = ['country', 'cardId', 'requestId', 'status','sentDate'];
  const paddingClass = reducedPaddingKeys.includes(key) ? 'px-1' : 'px-3';
 const extraSpaceClass = key === 'cardId' ? 'pl-5' : '';
  return (
   <th
  key={key}
  className={`${paddingClass} ${extraSpaceClass} py-2 cursor-pointer text-left text-sm font-sans bg-gray-100 font-bold`}
  onClick={() => handleSort(key as SortableColumn)}
>
  <div className="flex  items-center gap-1">
    <span className="font-semibold">{label}</span>
    <span>{renderSortIcon(key as SortableColumn)}</span>
  </div>
</th>

  );
})}

      <th className="px-2 py-2 w-20 bg-gray-100 overflow-x-auto"></th>
    </tr>
  </thead>
);


  const renderTableRows = (rows: typeof filteredData) =>
    rows.length === 0 ? (
      <tr className="bg-white  ">
         <td colSpan={11} className="text-center py-20 text-gray-500">
          No invites found.
        </td>
      </tr>
    ) : (
      rows.map((row) => (
        <tr key={row.id} className="border-b bg-white hover:bg-gray-50  text-xs">
         
        <td className="px-3 py-2 max-w-[150px]">
  <div className=" overflow-auto whitespace-nowrap">
    {row.trial}
  </div>
</td>

          <td className="px-2 py-2 pl-3">{row.language}</td>
          <td className="px-3 py-2 pl-3">{row.mobile}</td>
           <td className="px-3 py-2 pl-3">{row.country}</td>
                 
          <td className="px-2 py-2 pl-6 ">{row.cardId}</td>
          <td className="px-3 py-2 pl-2">{row.requestId}</td>
          <td className="px-3 py-2 pl-2 whitespace-nowrap">
            {row.sentDate
              ? new Date(row.sentDate).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '-'}
          </td>
          <td className="px-3 py-2 pl-2">
            <StatusBadge status={row.status} />
          </td>
          <td className="px-3 py-2 pl-2">
            <ResendButton status={row.status} onResend={() => onResend(row.id)} />
          </td>
        </tr>
      ))
    );

  return (
  <div className=" mt-4 px-3 sm:px-6 md:px-10 py-4">

      {/* Table (Flat or Grouped) */}
    {!groupBy ? (
      <div className="mb-4 border rounded-2xl overflow-hidden shadow-sm">
        <div className="max-w-[1300px]">
          {/* Header table (no scroll) */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-base border-collapse table-auto sm:table-fixed">
              {renderColGroup()}
              {renderTableHeader()}
            </table>
          </div>
          {/* Scrollable body table */}
         <div className="max-h-[150px] md:max-h-[230px] overflow-y-auto overflow-x-auto">

            <table className="w-full min-w-[900px] text-base border-collapse table-auto sm:table-fixed">
              {renderColGroup()}
              <tbody>{renderTableRows(filteredData)}</tbody>
            </table>
          </div>
        </div>
      </div>
    ) : (
      // ✅ grouped table view
      <div className="mb-4 border rounded-2xl overflow-hidden shadow-sm">
        {/* Header table (no scroll) */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-base border-collapse table-auto sm:table-fixed">
            {renderColGroup()}
            {renderTableHeader()}
          </table>
        </div>
        {/* Scrollable grouped body table */}
        <div className="max-h-[400px] overflow-y-auto overflow-x-auto">
          <table className="w-full min-w-[900px] text-base border-collapse table-auto sm:table-fixed">
            {renderColGroup()}
            <tbody>
              {Object.entries(groupedData ?? {}).map(([group, rows]) => (
                <React.Fragment key={group}>
                  <tr className="bg-gray-100">
                    <td colSpan={9} className="px-4 py-3">
                      <button
                        onClick={() => toggleGroup(group)}
                        className="w-full flex rounded-2xl justify-between items-center bg-gray-200 px-4 py-3 text-left font-medium text-gray-700 hover:bg-gray-200"
                      >
                        <span>
                          {groupBy?.charAt(0).toUpperCase() + groupBy?.slice(1)}: {group} ({rows.length})
                        </span>
                        <span>{expandedGroups[group] ? '−' : '+'}</span>
                      </button>
                    </td>
                  </tr>

                  {expandedGroups[group] && (
                    <>
                      {/* Table headers per group */}
                      <tr className="bg-gray-50 text-gray-700 font-semibold text-xs">
                        <td className="px-3 py-2">Clinical trial</td>
                        <td className="px-3 py-2">Language</td>
                        <td className="px-3 py-2">Mobile</td>
                        <td className="px-3 py-2">Country</td>
                        <td className="px-3 py-2">Card ID</td>
                        <td className="px-3 py-2">Request ID</td>
                        <td className="px-3 py-2">Sent date</td>
                   
                  
                        <td className="px-3 py-2 hidden sm:table-cell">Status</td>
                        <td className="px-3 py-2 hidden sm:table-cell"></td>
                      </tr>

                      {/* Table rows */}
                      {rows.map((row) => (
                        <tr key={row.id} className="border-b bg-white hover:bg-gray-50 text-xs">
                          <td className="px-3 py-2 max-w-[150px] whitespace-nowrap overflow-auto">{row.trial}
                            {/* Mobile-only actions */}
                            <div className="sm:hidden mt-1 flex items-center gap-2">
                              <ResendButton status={row.status} onResend={() => onResend(row.id)} />
                            </div>
                          </td>
                          <td className="px-3 py-2 pl-3">{row.language}</td>
                          <td className="px-3 py-2 pl-3">{row.mobile}</td>
                          <td className="px-3 py-2 pl-3">{row.country}</td>
                          <td className="px-3 py-2 pl-2">{row.cardId}</td>
                          <td className="px-3 py-2 pl-2">{row.requestId}</td>
                          <td className="px-3 py-2 pl-2">
                            {row.sentDate
                              ? new Date(row.sentDate).toLocaleString('en-GB', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '-'}
                          </td>
                          <td className="px-3 py-2 hidden sm:table-cell">
                            <StatusBadge status={row.status} />
                          </td>
                          <td className="px-3 py-2">
                            <ResendButton status={row.status} onResend={() => onResend(row.id)} />
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

      

      <AddInviteModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
};

export default WalletInvitesTable;