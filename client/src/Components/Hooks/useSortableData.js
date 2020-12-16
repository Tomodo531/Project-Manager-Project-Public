import React, { useState, useMemo } from 'react';

export const useSortableData = (items, config = null) => {
	const [ sortConfig, setSortConfig ] = useState(config);

	const sortedItems = useMemo(
		() => {
			let sortableItems = [ ...items ];
			if (sortConfig !== null) {
				sortableItems.sort((a, b) => {
					if (a[sortConfig.key] < b[sortConfig.key]) {
						return sortConfig.direction === 'ascending' ? -1 : 1;
					}
					if (a[sortConfig.key] > b[sortConfig.key]) {
						return sortConfig.direction === 'ascending' ? 1 : -1;
					}
					return 0;
				});
			} else {
				sortableItems = [ ...items ];
			}
			return sortableItems;
		},
		[ items, sortConfig ]
	);

	const requestSort = (key) => {
		let direction = 'ascending';
		if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}

		if (sortConfig && sortConfig.key === key && sortConfig.direction === 'descending') {
			setSortConfig(null);
			return;
		}

		setSortConfig({ key, direction });
	};

	return { items: sortedItems, requestSort, sortConfig };
};
