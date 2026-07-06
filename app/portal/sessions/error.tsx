"use client";
import { Button, Card } from "@/components/ui";
export default function ErrorState({ reset }: { reset: () => void }) { return <Card className="p-8 text-center"><h2 className="text-lg font-black text-[#23328C]">Không thể mở lịch tư vấn</h2><p className="mt-2 text-sm text-slate-500">Hãy thử tải lại màn hình.</p><Button className="mt-5" onClick={reset}>Thử lại</Button></Card>; }
