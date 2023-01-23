type props = {
    params: {
        communityId: string;
    };
};
export default function Head({ params }: props) {
    return (
        <>
            <title>{params.communityId}</title>
            <meta
                content="width=device-width, initial-scale=1"
                name="viewport"
            />
            <meta
                name="description"
                content={`${params.communityId} community`}
            />
            <link rel="icon" href="/favicon.ico" />
        </>
    );
}
