export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const calculateStockStatus = (currentStock, monthlyRequired) => {
  const threshold = monthlyRequired * 0.2;
  if (currentStock === 0) return 'out_of_stock';
  if (currentStock < threshold) return 'low_stock';
  return 'in_stock';
};

export const getStockStatusColor = (status) => {
  switch (status) {
    case 'in_stock':
      return 'text-green-600 bg-green-50';
    case 'low_stock':
      return 'text-yellow-600 bg-yellow-50';
    case 'out_of_stock':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getStockStatusLabel = (status) => {
  switch (status) {
    case 'in_stock':
      return 'In Stock';
    case 'low_stock':
      return 'Low Stock';
    case 'out_of_stock':
      return 'Out of Stock';
    default:
      return 'Unknown';
  }
};

export const filterData = (data, searchTerm, fields) => {
  if (!searchTerm) return data;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return data.filter(item =>
    fields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(lowerSearchTerm);
    })
  );
};

export const sortData = (data, sortBy, sortOrder) => {
  return [...data].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    if (typeof aVal === 'string') {
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
