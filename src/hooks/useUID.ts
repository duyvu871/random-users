"use client";

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useUID = (): [() => string, {}] => {
	const [uidStore, setUIDStore] = useState<Record<string, boolean>>({});

	const generateUID = () => {
		return uuidv4();
	};

	return [generateUID, uidStore];
};

export default useUID;
