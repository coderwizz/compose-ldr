import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Experience =  () => {
    return (<>
    <Tabs defaultValue="account" className="w-[400px]">
    <TabsList>
        <TabsTrigger value="account">Work Experience</TabsTrigger>
        <TabsTrigger value="Education">Education</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
    </TabsList>
    <TabsContent value="Education">
        <ul className="p1-10"> 
            <li className="list-disc">CS at Stanford</li>
            <li className="list-disc">CS 229</li>
        </ul>
    </TabsContent>
    <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
        </>
    );
}

export default Experience;