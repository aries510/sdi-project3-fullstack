# SDI-PROJECT3-FULLSTACK

This project addresses a desire for tactical units operating in contested environments to have a decentralized supply and materials inventory application when access to cloud-based databases are denied.

----

# ABOUT THE PROJECT

This project is a full-stack Tactical Decentralized Logistics Hub. This application solves a shortfall at the military's tactical edge. In remote, contested, or heavily jammed operational environments, field units frequently lose satellite or cellular connectivity to centralized, cloud-based military logistics databases. When connectivity drops, troops on the ground lose the ability to track mission-critical assets—like ammunition, fuel, and medical supplies or execute manual integrity inspections. This application implements a clean Offline-First architecture optimized for rugged mobile devices. The app bridges the operational gap by allowing troops to securely log consumption and perform inventory verifications entirely in a local browser sandbox while completely disconnected. Once a network connection is re-established, the user can execute a synch payload that updates the centralized database without duplicating records.

Potential Different Uses for the Application (Dual-Use Architecture)

While this application was designed to meet a strict requirement, its underlying engineering architecture is completely dual-use. Because it relies on containerization and localized client storage instead of constant network connectivity, it can be seamlessly redeployed for several high-impact industries 

    i.e. 

    Disaster Relief & Humanitarian Aid: 
        First responders operating in hurricanes, earthquakes, or wildfires where cellular towers are destroyed can use this tool to track incoming food rations, water bottles, and medicine inside an offline local staging camp.
        
    Offshore & Maritime Logistics:
        Deep-sea container ships, oil rigs, and research vessels traveling through international waters with highly limited or expensive satellite internet bandwidth can manage their localized warehouse inventories offline and sync only when docking.
        
    Subterranean & Mining Operations:
        Teams operating deep underground or inside heavy industrial complexes where wireless signals physically cannot penetrate can track equipment maintenance parts and safety gear inventories on rugged tablets, syncing their tallies upon returning to the surface hub.

How to Install and Run All Dependencies

To make this application as reproducible and scalable as possible, I have completely containerized the entire application and its dependencies. There is no need to manually download or install PostgreSQL, Node.js, or separate frontend runtimes on your host machine. Everything runs out of an isolated virtual environment.

Prerequisites:
    Ensure you have Docker Desktop installed on your computer.
        https://www.docker.com/products/docker-desktop/
    
Step-by-Step Launch Procedure:

    1. Clone the Repository:

    2. Open your terminal and navigate into the project root directory.
        
    3. Spin Up the Stack: 
        
        Run the following single command to download dependencies, compile the custom images, and build the persistent storage containers:

        ` docker compose up --build `

    4. Access the Software: 
        
        Once the terminal logs stabilize, open your favorite web browser and navigate to: http://localhost:5173 
        
        To verify the Express API gateway is communicating with your Postgres instance, navigate to: http://localhost:5000/api/suppliesTear Down
        
        To cleanly stop and park the containers without losing your data, hit Ctrl + C in your terminal or run
        
            ` docker compose down `