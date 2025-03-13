import { connectToDatabase } from '../utils/mongoConnect';
import UserModel from '../models/user.model';

async function promoteToProductManager(email: string): Promise<void> {
  try {
    await connectToDatabase();
    
    // Find user by email
    const user = await UserModel.findOne({ 'contactInfo.email': email });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }
    
    // Update user to product manager
    user.memberType = 'product';
    await user.save();
    
    console.log(`User ${user.firstName} ${user.lastName} (${email}) has been promoted to product manager`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to promote user:', error);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address: npm run promote-manager your-email@example.com');
  process.exit(1);
}

// Run the promotion
promoteToProductManager(email); 