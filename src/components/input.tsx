// Input.tsx
import React, { forwardRef, InputHTMLAttributes, ReactNode, useState, useOptimistic } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	startContent?: ReactNode;
	endContent?: ReactNode;
	classNames?: {
		input?: string;
		wrapper?: string;
		startContent?: string;
		endContent?: string;
	};
};

const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			startContent,
			endContent,
			classNames = {},
			className: _className, // Avoid conflict with external className
			...rest
		},
		ref
	) => {
		const [value, setValue] = useOptimistic<string>('', );

		const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			setValue(event.target.value);
		};

		return (
			<div className={`relative ${classNames.wrapper}`}>
				{startContent && (
					<span className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${classNames.startContent}`}>
            {startContent}
          </span>
				)}

				<input
					{...rest}
					ref={ref}
					value={value}
					onChange={handleChange}
					className={`block w-full pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
						classNames.input || ''
					} ${startContent ? 'pl-10' : ''} ${
						endContent ? 'pr-10' : ''
					}`}
				/>

				{endContent && (
					<span className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none ${classNames.endContent}`}>
            {endContent}
          </span>
				)}
			</div>
		);
	}
);

export default Input;