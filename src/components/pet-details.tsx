"use client";

import Image from "next/image";
import { Pet } from "@/lib/types";
import { usePetContext } from "@/lib/hooks";

export default function PetDetails() {
  const { selectedPet } = usePetContext();

  return (
    <section className="flex flex-col h-full w-full">
      {!selectedPet ? (
        <EmptyView />
      ) : (
        <>
          <TopBar selectedPet={selectedPet} />

          <OtherInfo selectedPet={selectedPet} />

          <Notes selectedPet={selectedPet} />
        </>
      )}
    </section>
  );
}

function EmptyView() {
  return (
    <div className="h-full flex justify-center items-center">
      <p className="text-2xl font-medium">No pet selected</p>
    </div>
  );
}

type Props = {
  selectedPet: Pet;
};

function TopBar({ selectedPet }: Props) {
  return (
    <div className="flex items-center bg-white px-8 py-5 border-b border-black/[0.08]">
      <Image
        src={selectedPet?.imageUrl}
        alt="Selected pet image"
        height={75}
        width={75}
        className="h-[75px] w-[75px] rounded-full object-cover"
      />

      <h2 className="text-3xl font-semibold leading-7 ml-5">
        {selectedPet?.name}
      </h2>
    </div>
  );
}

function OtherInfo({ selectedPet }: Props) {
  return (
    <div className="flex justify-around py-10 px-5 text-center">
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">
          Owner name
        </h3>
        <p className="mt-1 text-lg text-zinc-800">{selectedPet?.ownerName}</p>
      </div>

      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">Age</h3>
        <p className="mt-1 text-lg text-zinc-800">{selectedPet?.age}</p>
      </div>
    </div>
  );
}

function Notes({ selectedPet }: Props) {
  return (
    <section className="bg-white px-7 py-5 rounded-md mb-9 mx-8 flex-1 border border-black/[0.08]">
      {selectedPet?.notes}
    </section>
  );
}
