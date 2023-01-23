export default function Layout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {/* Include shared UI here e.g. a header or sidebar */}
            {children}
        </div>
    );
}
