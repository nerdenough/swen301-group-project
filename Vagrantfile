Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.hostname = "swen301-group-project"
  config.vm.synced_folder ".", "/var/www/swen301-group-project"

  config.vm.network "private_network", ip: "10.1.0.50"
  config.vm.network "forwarded_port", guest: 3306, host: 13306
  config.vm.network "forwarded_port", guest: 80, host: 8080

  config.vm.provider "virtualbox" do |vb|
    vb.name = "swen301-group-project"
    vb.memory = "1024"
  end

  config.vm.provision "shell", path: "setup.sh"
end
