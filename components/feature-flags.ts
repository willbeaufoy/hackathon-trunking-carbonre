export const isFeatureSet = (flagName: string): boolean =>
	localStorage.getItem(`feature-${flagName}`) === 'true';
