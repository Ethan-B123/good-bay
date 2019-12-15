export function trunc(n: number) {
	const rounded = `${Math.floor(n * 100) / 100}`;
	const nums = rounded.split('.');
	if (nums.length === 1) nums.push('00');
	nums[1] += '0';
	nums[1] = nums[1].slice(0, 2);
	const withDec = nums.join('.');
	return withDec;
}