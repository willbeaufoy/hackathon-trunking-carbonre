import Layout from '@/components/layout';
import BumpUnauthorised from '@/components/login/bump-unauthorised';

export default function Page() {
	return (
		<BumpUnauthorised>
			<Layout>
				<h1>Chat</h1>
			</Layout>
		</BumpUnauthorised>
	);
}
