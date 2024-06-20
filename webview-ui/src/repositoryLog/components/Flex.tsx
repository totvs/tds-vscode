import React from 'react';

export const Flex: React.FC = (children: any) => {
	return (
		<div
			style={{
				display: 'flex',
				minHeight: '100vh',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			{children}
		</div>
	);
};