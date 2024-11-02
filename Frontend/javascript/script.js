async function loadAndTypeText() {

    const text = "The History of Planet Earth: From Cosmic Dust to Modern DayThe Formation Era (4.6 - 4.5 Billion Years Ago)Our planet's story begins in the swirling chaos of the early solar system. About 4.6 billion years ago, gravity pulled together a massive cloud of gas and dust, forming a proto-planetary disk around our young Sun. Through a process called accretion, increasingly larger particles collided and merged, eventually forming Earth and its sister planets.The early Earth was a hellish place - a molten sphere bombarded constantly by asteroids and comets. One particularly massive collision with a Mars-sized object, dubbed Theia, ejected enough material to form our Moon. This impact may have also given Earth its characteristic tilt, creating our seasons.The Hadean Eon (4.5 - 4 Billion Years Ago)Named after Hades, the Greek god of the underworld, this period saw Earth's surface gradually cool and solidify. The first atmosphere formed primarily from volcanic outgassing, consisting mainly of water vapor, carbon dioxide, and nitrogen. As the planet cooled, water vapor condensed into oceans, and the first crustal rocks formed.The Archean Eon (4 - 2.5 Billion Years Ago)Life emerged during this period, though exactly when and how remains debated. The first organisms were simple prokaryotes, possibly emerging around hydrothermal vents in the ancient oceans. A crucial development was the evolution of photosynthetic cyanobacteria, which began releasing oxygen as a waste product - setting the stage for the Great Oxidation Event.The Proterozoic Eon (2.5 Billion - 541 Million Years Ago)The Great Oxidation Event transformed Earth's atmosphere, creating conditions necessary for complex life. Oxygen levels rose dramatically, forming the ozone layer and rusting much of Earth's iron - creating the banded iron formations we see today. The first multicellular organisms evolved, including the earliest algae and fungi.This era also saw several ";
    typeText(text);
}

function typeText(text) {
    const output = document.getElementById('output');
    output.value = ''; // Clear the text area
    let i = 0;

    function typeCharacter() {
        if (i < text.length) {
            output.value += text.charAt(i); // Add one character at a time
            i++;
            setTimeout(typeCharacter, 50); // Adjust typing speed (50ms)
        }
    }

    typeCharacter();
}

