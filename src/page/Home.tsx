import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function Home() {
    return (
        <main className="home-page flex flex-col justify-center m-auto w-4xl overflow-hidden gap-3 p-8">
            {[...new Array(10)].map(_ => {
                return (
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-4xl">Some news headline</CardTitle>
                            <CardDescription>News description...</CardDescription>
                            <CardAction>29/11/2025</CardAction> {/*this is date published */}
                        </CardHeader>
                        <CardContent>
                            {/* <p>Card Content</p> */}
                            {/* we do img if theres any, ONLY IMG FROM API WE WONT DO IMG IN DB🙏 */}
                            <img src="/vite.svg" alt="" className="w-3xs m-auto"/>
                        </CardContent>
                    </Card>
                )
            })}
        </main>
    );
}